namespace CinemaBookingApp.Models.DTOs
{
    public class ShowingTime
    {
        public class ShowingTimeInRoomDTO
        {
            public long ShowingTimeId { get; set; }

            public DateTime StartTime { get; set; }


        }

        public class ShowingTimeInTicketDTO : ShowingTimeInRoomDTO
        {

        }
    }
}
