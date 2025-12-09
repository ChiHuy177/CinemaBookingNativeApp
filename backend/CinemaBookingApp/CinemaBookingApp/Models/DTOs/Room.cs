using static CinemaBookingApp.Models.DTOs.RoomType;
using static CinemaBookingApp.Models.DTOs.ShowingTime;

namespace CinemaBookingApp.Models.DTOs
{
    public class Room
    {
        public class RoomInCinemaDTO
        {
            public long RoomId { get; set; }

            public string Name { get; set; }

            public RoomTypeInRoomDTO RoomType { get; set; }

            public ICollection<ShowingTimeInRoomDTO> ShowingTimes { get; set; }
        }
    }
}
