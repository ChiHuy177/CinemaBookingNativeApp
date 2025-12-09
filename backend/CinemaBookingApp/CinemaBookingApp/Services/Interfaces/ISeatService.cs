using static CinemaBookingApp.Models.DTOs.Seat;

namespace CinemaBookingApp.Services.Interfaces
{
    public interface ISeatService
    {
        Task<ICollection<SeatRowForBookingDTO>> GetSeatsForBookingAsync(long showingTimeId);
    }
}
