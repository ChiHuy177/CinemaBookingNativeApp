namespace CinemaBookingApp.Models.DTOs
{
    public class Rank
    {
        public class RankDTO
        {
            public long RankId { get; set; }

            public string Name { get; set; }
        }

        public class ClientRankDTO
        {
            public long RankId { get; set; }

            public double Discount { get; set; }
        }
    }
}
