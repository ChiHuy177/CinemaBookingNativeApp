using System.ComponentModel.DataAnnotations;

namespace CinemaBookingApp.Models.Entities
{
    public class Genre
    {
        [Key]
        public long GenreId { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        public ICollection<GenreMovie> GenreMovies { get; set; }
    }
}
