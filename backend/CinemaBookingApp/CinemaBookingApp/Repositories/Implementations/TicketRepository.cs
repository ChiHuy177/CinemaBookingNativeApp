using CinemaBookingApp.Data;
using CinemaBookingApp.Helpers.Validators.Combo;
using CinemaBookingApp.Models.Entities;
using CinemaBookingApp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using static CinemaBookingApp.Models.DTOs.Combo;
using static CinemaBookingApp.Models.DTOs.Coupon;
using static CinemaBookingApp.Models.DTOs.Movie;
using static CinemaBookingApp.Models.DTOs.Seat;
using static CinemaBookingApp.Models.DTOs.ShowingTime;
using static CinemaBookingApp.Models.DTOs.Ticket;

namespace CinemaBookingApp.Repositories.Implementations
{
    public class TicketRepository : ITicketRepository
    {
        private readonly AppDbContext _context;

        public TicketRepository(AppDbContext context) { 
            _context = context;
        }

        public async Task<Ticket> AddAsync(Ticket ticket)
        {
            _context.Ticket.Add(ticket);
            await _context.SaveChangesAsync();

            return ticket;
        }

        public async Task<ICollection<MyTicketDTO>> GetAllAsync()
        {
            var tickets = await _context.Ticket.Include(t => t.Movie).Include(t => t.ShowingTime).Select(t => new MyTicketDTO
            {
                CinemaName = t.CinemaName,
                TicketId = t.TicketId,         
                Movie = new MovieInTicketDTO
                {
                    MovieId = t.MovieId,
                    Title = t.Movie.Title
                },
               ShowingTime = new ShowingTimeInTicketDTO {
                    ShowingTimeId = t.ShowingTime.ShowingTimeId,
                    StartTime = t.ShowingTime.StartTime
               },      
               IsActive = t.IsActive,
               UsedAt = t.UsedAt,
               TotalPrice = t.TotalPrice

            }).OrderByDescending( t=> t.TicketId).ToListAsync();

            return tickets;
        }

        public async Task<Ticket?> GetByIdAsync(long ticketId)
        {
            var ticket = await _context.Ticket.Include(t => t.ShowingTime).Include(t => t.Coupon).Include(t => t.ComboTickets).ThenInclude(ct => ct.Combo)
                .Include(t => t.Movie).Include(t => t.TicketSeats).ThenInclude(ts => ts.Seat).FirstOrDefaultAsync(t => t.TicketId == ticketId);

            return ticket;

        }

        public async Task MarkTicketAsUsed(Ticket ticket)
        {
            ticket.UsedAt = DateTime.Now;
            ticket.IsActive = false;

            await _context.SaveChangesAsync();
        }

        public async Task<Ticket?> GetByTicketCodeAsync(string ticketCode)
        {
            var ticket = await _context.Ticket.FirstOrDefaultAsync(t => t.TicketCode == ticketCode);

            return ticket;
        }
    }
}
