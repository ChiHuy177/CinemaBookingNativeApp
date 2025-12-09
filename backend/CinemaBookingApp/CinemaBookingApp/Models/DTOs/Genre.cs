namespace CinemaBookingApp.Models.DTOs
{
    public class Genre
    {
        public class GenreDTO
        {
            public long GenreId { get; set; }

            public string Name { get; set; }

        }

        public class CreateGenreDTO
        {

            public string Name { get; set; }
        }

        public class UpdateGenreDTO
        {
            public string Name { get; set; }
        }
    }
}
