using CinemaBookingApp.Models.Entities;
using CinemaBookingApp.Repositories.Interfaces;
using CinemaBookingApp.Services.Interfaces;

namespace CinemaBookingApp.Services.Implementations
{
    public class GenreMovieService : IGenreMovieService
    {
        private readonly IGenreMovieRepository _genreMovieRepository;
        
        public GenreMovieService(IGenreMovieRepository genreMovieRepository)
        {
             _genreMovieRepository = genreMovieRepository;
        }

        public async Task AddRangeAsync(IEnumerable<long> genreIDs,long movieID)
        {
            List<GenreMovie> genreMovies = genreIDs.Select(id => new GenreMovie
            {
                GenreId = id,
                MovieId = movieID,
            }).ToList();

            await _genreMovieRepository.AddRangeAsync(genreMovies);
        }
    }
}
