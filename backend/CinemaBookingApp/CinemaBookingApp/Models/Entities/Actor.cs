using System.ComponentModel.DataAnnotations;

namespace CinemaBookingApp.Models.Entities
{
    public class Actor
    {
        [Key]
        public long ActorId { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [StringLength(500)]
        public string ImageURL { get; set; }

        // Navigation properties
        public ICollection<MovieActor> MovieActors { get; set; }
    }
}
