using CinemaBookingApp.Models.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using static CinemaBookingApp.Models.DTOs.Combo;
using static CinemaBookingApp.Models.DTOs.Coupon;
using static CinemaBookingApp.Models.DTOs.Movie;
using static CinemaBookingApp.Models.DTOs.Seat;
using static CinemaBookingApp.Models.DTOs.ShowingTime;

namespace CinemaBookingApp.Models.DTOs
{
    public class Ticket
    {
        public class TicketDTO
        {
            public long TicketId { get; set; }

            public string TicketCode { get; set; }

            public MovieInTicketDTO Movie { get; set; }

            public string CinemaName { get; set; }

            public ShowingTimeInTicketDTO ShowingTime { get; set; }

            public ICollection<SeatInTicketDTO> Seats { get; set; }

            public double TotalPriceSeats { get; set; }

            public double TotalPriceCombos { get; set; }

            public double TotalPriceDiscount { get; set; }

            public double LoyalPointsUsed { get; set; }

            public double TotalRankDiscount { get; set; }

            public double TotalPrice { get; set; }

            public bool IsActive { get; set; }

            public DateTime? UsedAt { get; set; }

            public DateTime CreatedAt { get; set; }

            public ICollection<ComboInTicketDTO> Combos { get; set; }

            public CouponInTicketDTO Coupon { get; set; }

        }

        public class CreateTicketDTO
        {
            public long MovieId { get; set; }

            public string CinemaName { get; set; }

            public ICollection<long> SeatIds { get; set; }

            public ICollection<ComboInTicketDTO> Combos { get; set; }

            public double TotalPrice { get; set; }

            public long ShowingTimeId { get; set; }

            public double TotalPriceSeats { get; set; }

            public double TotalPriceCombos { get; set; }

            public double TotalPriceDiscount { get; set; }

            public double TotalRankDiscount { get; set; }

            public double LoyalPointsUsed { get; set; }

            public long? CouponId { get; set; }

            public string ClientEmail { get; set; }

            public string MovieTitle { get; set; }

        }


        public class TicketCheckingDTO
        {
            public long? TicketId { get; set; }

            public ICollection<UnAvailableSeatDTO> UnavailableSeats { get; set; }

            public ICollection<UnAvailableComboDTO> UnavailableCombos { get; set; }
        }

        public class TicketForEmailDTO
        {
            public string TicketCode { get; set; }

            public string MovieTitle { get; set; }

            public string CinemaName { get; set; }

            public DateTime StartTime { get; set; }

            public double TotalPrice { get; set; }

            public ICollection<string> SeatsName { get; set; }
        }

        public class MyTicketDTO{
            public long TicketId { get; set; }

            public MovieInTicketDTO Movie { get; set; }

            public string CinemaName { get; set; }

            public bool IsActive { get; set; }

            public DateTime? UsedAt { get; set; }

            public double TotalPrice { get; set; }

            public ShowingTimeInTicketDTO ShowingTime { get; set; }

        }

   
    }
}
