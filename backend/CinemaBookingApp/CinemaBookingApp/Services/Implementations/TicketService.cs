using AutoMapper;
using CinemaBookingApp.Excecptions;
using CinemaBookingApp.Helpers.Email;
using CinemaBookingApp.Helpers.QR_Code;
using CinemaBookingApp.Models.Entities;
using CinemaBookingApp.Repositories.Interfaces;
using CinemaBookingApp.Services.Interfaces;
using System;
using System.Security.Claims;
using System.Text;
using static CinemaBookingApp.Models.DTOs.Combo;
using static CinemaBookingApp.Models.DTOs.Coupon;
using static CinemaBookingApp.Models.DTOs.Movie;
using static CinemaBookingApp.Models.DTOs.Seat;
using static CinemaBookingApp.Models.DTOs.ShowingTime;
using static CinemaBookingApp.Models.DTOs.Ticket;

namespace CinemaBookingApp.Services.Implementations
{
    public class TicketService : ITicketService
    {
        private readonly ITicketRepository _ticketRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly Random _random = new();
        private readonly ISeatRepository _seatRepository;
        private readonly IComboRepository _comboRepository;
        private readonly IEmailSender _emailSender;
        private readonly IClientRepository _clientRepository;
        private readonly IRankRepository _rankRepository;
        private readonly ICouponRepository _couponRepository;
        private readonly ICouponUserRepository _couponUserRepository;
        private readonly ITicketSeatRepository _ticketSeatRepository;
        private readonly IComboTicketRepository _comboTicketRepository;
        private readonly IShowingTimeRepository _showingTimeRepository;
        public TicketService(ITicketRepository ticketRepository,
            IHttpContextAccessor httpContextAccessor, ISeatRepository seatRepository
            , IComboRepository comboRepository, IEmailSender emailSender,
            IClientRepository clientRepository, IRankRepository rankRepository
            , ICouponRepository couponRepository,ICouponUserRepository couponUserRepository
            , ITicketSeatRepository ticketSeatRepository, IComboTicketRepository comboTicketRepository
            , IShowingTimeRepository showingTimeRepository)
        {
            _ticketRepository = ticketRepository;
            _httpContextAccessor = httpContextAccessor;
            _seatRepository = seatRepository;
            _comboRepository = comboRepository;
            _emailSender = emailSender;
            _clientRepository = clientRepository;
            _rankRepository = rankRepository;
            _couponRepository = couponRepository;
            _couponUserRepository = couponUserRepository;
            _ticketSeatRepository = ticketSeatRepository;
            _comboTicketRepository = comboTicketRepository;
            _showingTimeRepository = showingTimeRepository;
        }

        public async Task<ICollection<MyTicketDTO>> GetAllAsync()
        {
            var clientEmail =  GetClientEmailFromClaims();
            if(clientEmail == null)
            {
                throw new ApiException(ErrorCode.UNAUTHORIZED);
            }

            var result = await _ticketRepository.GetAllAsync();

            return result;
        }

        public async Task<TicketCheckingDTO> AddAsync(CreateTicketDTO dto)
        {

            var clientEmail = GetClientEmailFromClaims();

            if(clientEmail == null || clientEmail != dto.ClientEmail)
            {
                throw new ApiException(ErrorCode.UNAUTHORIZED);
            }
 
            var client = await _clientRepository.GetByEmailAsync(dto.ClientEmail);

            if (client == null)
            {
                throw new ApiException(ErrorCode.NOT_FOUND);
            }

            var showingTime = await _showingTimeRepository.GetByIdAsync(dto.ShowingTimeId);

            if(showingTime== null)
            {
                throw new ApiException(ErrorCode.NOT_FOUND);
            }

            if (dto.CouponId != null )
            {

                var coupon = await _couponRepository.GetByIdAsync(dto.CouponId);

                if (coupon == null)
                {
                    throw new ApiException(ErrorCode.NOT_FOUND);
                }

                if (coupon.ExpiryDate < DateTime.UtcNow)
                {
                    throw new ApiException(ErrorCode.CODE_EXPIRED);
                }

                var couponUser = await _couponUserRepository.GetByIdAndClientIdAsync(coupon.CouponId, client.ClientId);
                if (couponUser == null)
                {
                    throw new ApiException(ErrorCode.NOT_FOUND);
                }

                if (couponUser.IsUsed)
                {
                    throw new ApiException(ErrorCode.COUPON_USED);
                }

                couponUser.IsUsed = true;
            }


            var unavailableSeats = await _seatRepository.GetUnAvailableSeatsForBookingAsync(dto.SeatIds);

            var unavailableCombos = await _comboRepository.GetUnavailableCombosForBookingAsync(dto.Combos);
  

            if (unavailableCombos.Count() > 0 || unavailableSeats.Count() > 0)
            {
      
                return new TicketCheckingDTO
                {
                    TicketId= -1,
                    UnavailableCombos = unavailableCombos,
                    UnavailableSeats = unavailableSeats
                };
            }

            var clientId = GetClientIdFromClaims();

            var ticket = new Ticket
            {
                ClientId = clientId,
                CouponId = dto.CouponId,
                CinemaName = dto.CinemaName,
                CreatedAt = DateTime.UtcNow,
                MovieId = dto.MovieId,
                LoyalPointsUsed = dto.LoyalPointsUsed,
                ShowingTimeId = dto.ShowingTimeId,
                TicketCode = GenerateTicketCode(),
                TotalPrice = dto.TotalPrice,
                TotalPriceCombos = dto.TotalPriceCombos,
                TotalPriceDiscount = dto.TotalPriceDiscount,
                TotalPriceSeats = dto.TotalPriceSeats,
                TotalRankDiscount = dto.TotalRankDiscount,
                UsedAt = null,            
            };

      
            var createdTicket = await _ticketRepository.AddAsync(ticket);
        
            await _ticketSeatRepository.AddRangeAsync(dto.SeatIds.Select(s => new TicketSeat
            {
                SeatId = s,
                TicketId = createdTicket.TicketId
            }).ToList());
     
            await _comboTicketRepository.AddRangeAsync(dto.Combos.Select(c => new ComboTicket
            {
                ComboId = c.ComboId,
                Quantity = c.Quantity,
                TicketId = createdTicket.TicketId
            }).ToList());
       
            await _seatRepository.MakeSeatsUnAvailableAsync(dto.SeatIds);
       
            await _comboRepository.ReduceQuantityCombosAsync(dto.Combos);
          
            var seatsName = await _seatRepository.GetSeatsNameAsync(dto.SeatIds);
    



            var ticketForEmail = new TicketForEmailDTO
            {
                CinemaName = createdTicket.CinemaName,
                MovieTitle =dto.MovieTitle,
                SeatsName = seatsName,
                StartTime = showingTime.StartTime,
                TicketCode = createdTicket.TicketCode,
                TotalPrice = createdTicket.TotalPrice
            };



            await _emailSender.SendTicketEmailAsync(dto.ClientEmail, $"Movie Ticket - {dto.MovieTitle}",ticketForEmail);

            await _clientRepository.UpdateLoyalPointsAndRankAsync(dto.LoyalPointsUsed, client, dto.TotalPrice);
           

            return new TicketCheckingDTO
            {
                TicketId = createdTicket.TicketId,
                UnavailableCombos = unavailableCombos,
                UnavailableSeats = unavailableSeats
            };
        }

        public async Task<TicketDTO> GetByIdAsync(long ticketId) {
            
            var ticket = await _ticketRepository.GetByIdAsync(ticketId);

            if(ticket == null)
            {
                throw new ApiException(ErrorCode.NOT_FOUND);
            }

            var ticketDTO = new TicketDTO
            {
                CinemaName = ticket.CinemaName,
                TicketCode = ticket.TicketCode,
                TicketId = ticket.TicketId,
                Seats = ticket.TicketSeats.Select(ts => new SeatInTicketDTO
                {
                    Column = ts.Seat.Column,
                    Row = ts.Seat.Row,
                    SeatId = ts.SeatId,
                }).ToList(),
                Movie = new MovieInTicketDTO
                {
                    MovieId = ticket.MovieId,
                    Title = ticket.Movie.Title
                },
                ShowingTime = new ShowingTimeInTicketDTO
                {
                    ShowingTimeId = ticket.ShowingTime.ShowingTimeId,
                    StartTime = ticket.ShowingTime.StartTime
                },
                Combos = ticket.ComboTickets.Select(ct => new ComboInTicketDTO
                {
                    ComboId = ct.ComboId,
                    Quantity = ct.Quantity,
                    Name = ct.Combo.Name
                }).ToList(),
                Coupon = new CouponInTicketDTO
                {
                    Code = ticket.Coupon == null ? null : ticket.Coupon.Code,
                    DiscountAmount = ticket.Coupon == null ? 0 : ticket.Coupon.DiscountAmount,
                },
                CreatedAt = ticket.CreatedAt,
                IsActive = ticket.IsActive,
                LoyalPointsUsed = ticket.LoyalPointsUsed,
                TotalPriceCombos = ticket.TotalPriceCombos,
                TotalPriceDiscount = ticket.TotalPriceDiscount,
                TotalPriceSeats = ticket.TotalPriceSeats,
                TotalRankDiscount = ticket.TotalRankDiscount,
                UsedAt = ticket.UsedAt,
                TotalPrice = ticket.TotalPrice,
            };

            return ticketDTO;
        }

        public async Task<bool> VerifyTicketAsync(string ticketCode)
        {
            var ticket = await _ticketRepository.GetByTicketCodeAsync(ticketCode);

            if (ticket == null) {
                throw new ApiException(ErrorCode.NOT_FOUND);
            }

            if (!ticket.IsActive)
            {
                return false;
            }

            await _ticketRepository.MarkTicketAsUsed(ticket);

            return true;

        }




        private long GetClientIdFromClaims()
        {
            var user = _httpContextAccessor.HttpContext?.User;

            var temp = user?.FindFirst("clientId")?.Value;

            if (temp == null)
            {
                throw new ApiException(ErrorCode.UNAUTHORIZED);
            }

            var clientId = long.Parse(temp);
            return clientId;
        }

        private string GetClientEmailFromClaims()
        {
            var user = _httpContextAccessor.HttpContext?.User;
            foreach (var claim in user?.Claims)
            {
                Console.WriteLine($"Claim Type: {claim.Type}, Value: {claim.Value}");
            }

            var email = user?.FindFirst(ClaimTypes.NameIdentifier)?.Value;



            if (email == null)
            {
                throw new ApiException(ErrorCode.UNAUTHORIZED);
            }


            return email;
        }

        private string GenerateTicketCode()
        {
            const string chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
            var randomPart = new string(Enumerable.Repeat(chars, 6)
                .Select(s => s[_random.Next(s.Length)]).ToArray());

            string prefix = "TCK";
            string datePart = DateTime.UtcNow.ToString("yyyyMMddHHmmss");

            return $"{prefix}-{datePart}-{randomPart}";
        }
    }
}
