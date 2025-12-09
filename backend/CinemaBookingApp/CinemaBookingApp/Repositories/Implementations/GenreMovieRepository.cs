using CinemaBookingApp.Data;
using CinemaBookingApp.Models.Entities;
using CinemaBookingApp.Repositories.Interfaces;

namespace CinemaBookingApp.Repositories.Implementations
{
    public class GenreMovieRepository : IGenreMovieRepository
    {
        private readonly AppDbContext _context;

        public GenreMovieRepository(AppDbContext context) { 
            _context = context;
        }

        public async Task AddRangeAsync(IEnumerable<GenreMovie> genreMovies)
        {
            _context.GenreMovie.AddRange(genreMovies);

            await _context.SaveChangesAsync();
        }
    }
}
