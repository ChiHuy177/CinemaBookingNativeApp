using static CinemaBookingApp.Models.DTOs.Cinema;

namespace CinemaBookingApp.Services.Interfaces
{
    public interface ICinemaService
    {
        Task<List<CinemaDTO>> GetAllAsync();

        Task<CinemaDTO> GetByIdAsync(long id);

        Task<List<CinemaWithCityCountDTO>> GetAllForBookingByCinemasAsync();

        Task<List<CinemaForBookingDTO>> GetCinemasForBookingAsync(long movieId);
    }
}
