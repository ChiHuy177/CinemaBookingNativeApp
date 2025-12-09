using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CinemaBookingApp.Models.Entities
{
    public class Ticket
    {
        [Key]
        public long TicketId { get; set; }

        [Required]
        public double TotalPrice { get; set; }

        public string CinemaName { get; set; }

        public long ShowingTimeId { get; set; }


        [ForeignKey("ShowingTimeId")]
        public ShowingTime ShowingTime { get; set; }

        public DateTime? UsedAt { get; set; }

        public DateTime CreatedAt { get; set; }= DateTime.Now;

        public double TotalPriceSeats { get; set; }

        public double TotalPriceCombos { get; set; }

        public double TotalPriceDiscount { get; set; }

        public double LoyalPointsUsed { get; set; }

        public double TotalRankDiscount { get; set; }

        public string TicketCode { get; set; }

        public bool IsActive { get; set; } = true;

        public ICollection<ComboTicket> ComboTickets { get; set; }

        public long? CouponId { get; set; }

        [ForeignKey("CouponId")]
        public Coupon? Coupon { get; set; }

        public long ClientId { get; set; }

        public Client Client { get; set; }

        public ICollection<TicketSeat> TicketSeats { get; set; }

        public long MovieId { get; set; }

        [ForeignKey("MovieId")]
        public Movie Movie { get; set; }
    }

}
