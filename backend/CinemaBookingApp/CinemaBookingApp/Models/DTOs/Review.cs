using static CinemaBookingApp.Models.DTOs.Client;

namespace CinemaBookingApp.Models.DTOs
{
    public class Review
    {
        public class ReviewInMovieDetailDTO
        {
            public string Comment { get; set; }

            public int Rating { get; set; }

            public DateTime CreatedAt { get; set; }

            public ClientInReviewDTO Client { get; set; }
        }

        public class ReviewCreateDTO
        {
            public long MovieId { get; set; }

            public string Comment { get; set; }

            public int Rating { get; set; }

        }
    }
}
