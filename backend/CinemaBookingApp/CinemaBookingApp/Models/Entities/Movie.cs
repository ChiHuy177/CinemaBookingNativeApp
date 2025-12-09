using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CinemaBookingApp.Models.Entities
{
    public class Movie
    {
        [Key]
        public long MovieId { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } 

        [StringLength(1000)]
        public string Description { get; set; }

        public int Duration { get; set; } 

        [StringLength(200)]
        public string Director { get; set; }

        [Column(TypeName = "date")]
        public DateTime ReleaseDate { get; set; } 

        [StringLength(500)]
        public string PosterURL { get; set; } 

        [StringLength(500)]
        public string TrailerURL { get; set; }

        public long TotalBooking { get; set; } = 0;

        public int? RequireAge { get; set; } 

        [StringLength(200)]
        public string Company { get; set; }

        [StringLength(50)]
        public string Language { get; set; }

        public long TotalLike { get; set; } = 0; 

        public bool IsAvailable { get; set; } = true;
        
        public ICollection<GenreMovie> GenreMovies { get; set; }

        public ICollection<MovieActor> MovieActors { get; set; }
        public ICollection<ShowingTime> ShowingTimes { get; set; }
        public ICollection<Review> Reviews { get; set; } 

        public ICollection<Favorite> Favorites { get; set; }

        public ICollection<Ticket> Tickets { get; set; }
    }
}
