using System.ComponentModel.DataAnnotations.Schema;

namespace CinemaBookingApp.Models.Entities
{
    public class ComboTicket
    {
        public int Quantity { get; set; }


        public long TicketId { get; set; }

        [ForeignKey("TicketId")]
        public Ticket Ticket { get; set; }

        public long ComboId { get; set; }

        [ForeignKey("ComboId")]
        public Combo Combo { get; set; }
    }
}
