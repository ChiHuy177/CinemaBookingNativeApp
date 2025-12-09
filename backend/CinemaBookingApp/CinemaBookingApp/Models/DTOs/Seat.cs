using static CinemaBookingApp.Models.DTOs.SeatType;

namespace CinemaBookingApp.Models.DTOs
{
    public class Seat
    {
        public class SeatColumnForBookingDTO
        {
            public long SeatId { get; set; }

            public int Column { get; set; }

            public string Status { get; set; }

            public string Row { get; set; }

            public SeatTypeDTO SeatType { get; set; }
        }

        public class SeatRowForBookingDTO
        {
            public string Row { get; set; }

            public ICollection<SeatColumnForBookingDTO> SeatColumns { get; set; }
        }

        public class UnAvailableSeatDTO
        {
            public long SeatId { get; set; }

            public int Column { get; set; }

            public string Row { get; set; }
        }

        public class SeatInTicketDTO : UnAvailableSeatDTO
        {

        }

    }
}
