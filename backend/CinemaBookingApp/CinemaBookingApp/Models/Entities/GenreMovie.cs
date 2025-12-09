namespace CinemaBookingApp.Models.Entities
{
    public class GenreMovie
    {
        public long MovieId { get; set; }

        public Movie Movie { get; set; }

        public long GenreId { get; set; }

        public Genre Genre { get; set; }
    }
}
