
using static CinemaBookingApp.Models.DTOs.Genre;
using static CinemaBookingApp.Models.DTOs.MovieActor;
using static CinemaBookingApp.Models.DTOs.Review;

namespace CinemaBookingApp.Models.DTOs
{
    public class Movie
    {
        public class MovieMainHomeDTO
        {
            public long MovieId { get; set; }

            public DateTime ReleaseDate { get; set; }

            public string PosterURL { get; set; }

            public long TotalLike { get; set; }

            public long TotalBooking { get; set; }

            public string Title { get; set; }

        }

        public class MovieDTO
        {
            public long MovieId { get; set; }

            public string Title { get; set; }

            public string Description { get; set; }

            public int Duration { get; set; }

            public string Director { get; set; }

            public DateTime ReleaseDate { get; set; }

            public string PosterURL { get; set; }

            public string TrailerURL { get; set; }

            public long TotalBooking { get; set; }

            public int? RequireAge { get; set; }

            public string Company { get; set; }

            public string Language { get; set; }

            public long TotalLike { get; set; } 

            public bool IsAvailable { get; set; } 

         
        }

        public class CreateMovieDTO
        {
            
            public string Title { get; set; }

            public string Description { get; set; }

            public int Duration { get; set; }

            public string Director { get; set; }

            public DateTime ReleaseDate { get; set; }

            public string? PosterURL { get; set; } = string.Empty;

            public string? TrailerURL { get; set; } = string.Empty;

            public int? RequireAge { get; set; }

            public string Company { get; set; }

            public string Language { get; set; }

            public ICollection<long>? GenreIDs { get; set; } = new List<long>();

            public ICollection<CreateMovieActorDTO>? CreateMovieActorDTOs { get; set; } = new List<CreateMovieActorDTO>();

        }

        public class UpdateMovieDTO
        {
            public string Title { get; set; }

            public string Description { get; set; }

            public int Duration { get; set; }

            public string Director { get; set; }

            public DateTime ReleaseDate { get; set; }

            public string PosterURL { get; set; }

            public string TrailerURL { get; set; }

            public int RequireAge { get; set; }

            public string Company { get; set; }

            public string Language { get; set; }


        }

        public class MovieDetailHomeDTO
        {
            public long MovieId { get; set; }

            public string Title { get; set; }

            public string Description { get; set; }

            public int Duration { get; set; }

            public string Director { get; set; }

            public string PosterURL { get; set; }

            public string TrailerURL { get; set; }

            public int RequireAge { get; set; }

            public string Company { get; set; }

            public string Language { get; set; }

            public long TotalLike { get; set; }

            public bool IsFavorite { get; set; }

            public double Rating { get; set; }
            
            public ICollection<MovieActorInDetailMovieDTO> MovieActors { get; set; }

            public ICollection<ReviewInMovieDetailDTO> Reviews { get; set; }        
            
            public ICollection<GenreDTO> Genres { get; set; }
           
        }

        public class MovieSearchDTO
        {
            public long MovieId { get; set; }

            public string Title { get; set; }

            public int Duration { get; set; }

            public DateTime ReleaseDate { get; set; }

            public string PosterURL { get; set; }

            public int? RequireAge { get; set; }

            public long TotalLike { get; set; }

            public double Rating { get; set; }

            public bool IsFavorite { get; set; }

            public ICollection<string> Genres { get; set; }
        }

        public class FavoriteMovieDTO : MovieSearchDTO
        {

        }

        public class MovieInTicketDTO
        {
            public long MovieId { get; set; }

            public string Title { get; set; }


        }
    }
}
