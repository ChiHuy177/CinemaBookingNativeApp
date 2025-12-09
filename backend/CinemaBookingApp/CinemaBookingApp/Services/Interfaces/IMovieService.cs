using static CinemaBookingApp.Models.DTOs.Movie;

namespace CinemaBookingApp.Services.Interfaces
{
    public interface IMovieService
    {
        Task<List<MovieDTO>> GetAllAsync();
        Task<MovieDTO> GetByIdAsync(long id);

        Task<MovieDTO> CreateAsync(CreateMovieDTO dto);

        Task<string> UpdateAsync(long id,UpdateMovieDTO dto);

        Task<string> DeleteAsync(long id);

        Task<MovieDetailHomeDTO> GetAsMovieDetailHomeAsync(long id);

        Task<List<MovieMainHomeDTO>> GetAllAsMovieMainHomeAsync();

        Task<long> AddFavoriteMovieAsync(long movieId);

        Task<long> RemoveFavoriteMovieAsync(long movieId);

        Task<List<MovieSearchDTO>> SearchMovieByNameAndGenreAsync(string value);

        Task<List<FavoriteMovieDTO>> FavoriteMoviesAsync();

        Task<ICollection<MovieSearchDTO>> GetMoviesByCinemaIdAsync(long cinemaId,DateTime date);

    }
}
