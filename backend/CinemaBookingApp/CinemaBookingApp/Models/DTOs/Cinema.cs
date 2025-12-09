using static CinemaBookingApp.Models.DTOs.Room;
using static CinemaBookingApp.Models.DTOs.ShowingTime;

namespace CinemaBookingApp.Models.DTOs
{
    public class Cinema
    {
        public class CinemaDTO
        {
            public long CinemaId { get; set; }

            public string Name { get; set; }

            public string Address { get; set; }

            public string Hotline { get; set; }

            public string City { get; set; }
        }

        public class CinemaWithCityCountDTO 
        {

            public List<CinemaDTO> Cinemas { get; set; }

            public string City { get; set; }

            public int Count { get; set; }
        }


        public class CinemaForBookingDTO
        { 
        
            public long CinemaId { get; set; }

            public string Name { get; set; }

            public ICollection<RoomInCinemaDTO> Rooms { get; set; }
        }

    }
}
