using System.ComponentModel.DataAnnotations.Schema;

namespace CinemaBookingApp.Models.Entities
{
    public class TicketSeat
    {
        public long SeatId { get; set; }

        public long TicketId { get; set; }

        [ForeignKey("SeatId")]
        public Seat Seat { get; set; }


        [ForeignKey("TicketId")]
        public Ticket Ticket { get; set; }
    }
}
