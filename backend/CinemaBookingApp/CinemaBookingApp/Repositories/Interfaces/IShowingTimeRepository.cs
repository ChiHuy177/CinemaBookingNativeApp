using CinemaBookingApp.Models.Entities;

namespace CinemaBookingApp.Repositories.Interfaces
{
    public interface IShowingTimeRepository
    {
        Task<ShowingTime?> GetByIdAsync(long showingTimeId);
    }
}
