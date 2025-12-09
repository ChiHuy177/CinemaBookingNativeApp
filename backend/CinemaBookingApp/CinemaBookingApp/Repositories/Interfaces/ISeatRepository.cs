using CinemaBookingApp.Models.Entities;
using static CinemaBookingApp.Models.DTOs.Seat;

namespace CinemaBookingApp.Repositories.Interfaces
{
    public interface ISeatRepository
    {
        Task<ICollection<SeatRowForBookingDTO>> GetSeatsForBookingAsync(long showingTimeId);

        Task<ICollection<UnAvailableSeatDTO>> GetUnAvailableSeatsForBookingAsync(ICollection<long> seatIds);

        Task MakeSeatsUnAvailableAsync(ICollection<long> seatIds);

        Task<ICollection<string>> GetSeatsNameAsync(ICollection<long> seatIds); 
    }
}
