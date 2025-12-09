using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CinemaBookingApp.Models.Entities
{
    public class Room
    {
        [Key]
        public long RoomId { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        // Foreign keys
        public long RoomTypeId { get; set; }
        public long CinemaId { get; set; }

        // Navigation properties
        [ForeignKey("RoomTypeId")]
        public RoomType RoomType { get; set; }

        [ForeignKey("CinemaId")]
        public Cinema Cinema { get; set; }

        public ICollection<Seat> Seats { get; set; }
        public ICollection<ShowingTime> ShowingTimes { get; set; }
    }
}
