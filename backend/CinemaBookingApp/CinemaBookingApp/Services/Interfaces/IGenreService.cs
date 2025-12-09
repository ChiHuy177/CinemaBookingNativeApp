using static CinemaBookingApp.Models.DTOs.Genre;

namespace CinemaBookingApp.Services.Interfaces
{
    public interface IGenreService
    {
        Task<List<GenreDTO>> GetAllAsync();
        Task<GenreDTO> GetByIdAsync(long id);
        Task<GenreDTO> CreateAsync(CreateGenreDTO dto);
        Task<string> UpdateAsync(long id, UpdateGenreDTO dto);
        Task<string> DeleteAsync(long id);
    }
}
