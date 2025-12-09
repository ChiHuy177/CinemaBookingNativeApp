using CinemaBookingApp.Models.Entities;

namespace CinemaBookingApp.Repositories.Interfaces
{
    public interface ICinemaRepository
    {
        Task<List<Cinema>> GetAllAsync();

        Task<Cinema> GetByIdAsync(long id);

        Task<List<Cinema>> GetCinemasForBookingAsync(long movieId);
    }
}
