using System.ComponentModel.DataAnnotations;

namespace CinemaBookingApp.Models.Entities
{
    public class RoomType
    {
        [Key]
        public long RoomTypeId { get; set; }

        public int TotalSeat { get; set; }

        [Required]
        [StringLength(50)]
        public string Name { get; set; } // Small, Large

        // Navigation properties
        public ICollection<Room> Rooms { get; set; }
    }
}
