namespace CinemaBookingApp.Models.DTOs
{
    public class Favorite
    {
        public class AddFavoriteMovieDTO { 
        
            public long ClientId { get; set; }

            public long MovieId { get; set; }
        }

    }
}
