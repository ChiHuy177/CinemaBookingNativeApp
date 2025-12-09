using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CinemaBookingApp.Models.Entities
{
    public class Seat
    {
        [Key]
        public long SeatId { get; set; }

        [Required]
        [StringLength(10)]
        public string Row { get; set; }

        public int Column { get; set; }

        public bool IsAvailable { get; set; }

        public long SeatTypeId { get; set; }
        public long RoomId { get; set; }

        [ForeignKey("SeatTypeId")]
        public SeatType SeatType { get; set; }

        [ForeignKey("RoomId")]
        public Room Room { get; set; }

        public ICollection<TicketSeat> TicketSeats { get; set; }
    }
}
