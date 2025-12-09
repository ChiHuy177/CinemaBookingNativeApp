using System.ComponentModel.DataAnnotations;

namespace CinemaBookingApp.Models.Entities
{
    public class Cinema
    {
        [Key]
        public long CinemaId { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [Required]
        [StringLength(500)]
        public string Address { get; set; }

        [StringLength(20)]
        public string Hotline { get; set; }

        [StringLength(100)]
        public string City { get; set; }

        // Navigation properties
        public ICollection<Room> Rooms { get; set; }
    }
}
