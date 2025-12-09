using CinemaBookingApp.Models.Entities;
using static CinemaBookingApp.Models.DTOs.Movie;

namespace CinemaBookingApp.Repositories.Interfaces
{
    public interface IMovieRepository
    {
        Task<List<Movie>> GetAllAsync();
        Task<Movie?> GetByIdAsync(long id);
        
        Task<Movie> AddAsync(Movie movie);

        Task UpdateAsync(Movie movie);

        Task DeleteAsync(Movie movie);

        Task<List<Movie>> GetAllAsMovieMainHomeAsync();

        Task<Movie?> GetAsMovieDetailHomeAsync(long id,long clientId);

        Task<long> AddFavoriteMovieAsync(long movieId, long clientId);

        Task<long> RemoveFavoriteMovieAsync(long movieId,long clientId);

        Task<List<MovieSearchDTO>> SearchMovieByNameAndGenreAsync(string value,long clientId);

        Task<List<FavoriteMovieDTO>> FavoriteMoviesAsync(long clientId);

        Task<ICollection<MovieSearchDTO>> GetMoviesByCinemaIdAsync(long cinemaId,long clientId,DateTime date);
    }
}
