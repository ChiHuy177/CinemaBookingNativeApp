using CinemaBookingApp.Models.Entities;

namespace CinemaBookingApp.Repositories.Interfaces
{
    public interface IGenreMovieRepository
    {
       Task AddRangeAsync(IEnumerable<GenreMovie> genreMovies);
    }
}
