using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CinemaBookingApp.Models.Entities
{
    public class MovieActor
    {

        public long MovieId { get; set; }

        public long ActorId { get; set; }

        [Required]
        [StringLength(200)]
        public string CharacterName { get; set; }

        [ForeignKey("MovieId")]
        public Movie Movie { get; set; }

        [ForeignKey("ActorId")]
        public Actor Actor { get; set; }
    }
}
