using System.ComponentModel.DataAnnotations;

namespace CinemaBookingApp.Models.Entities
{
    public class SeatType
    {
        [Key]
        public long SeatTypeId { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        public double Price { get; set; }

        // Navigation properties
        public ICollection<Seat> Seats { get; set; }
    }
}
