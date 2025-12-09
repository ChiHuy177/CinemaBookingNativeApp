using CinemaBookingApp.Data;
using CinemaBookingApp.Models.Entities;
using CinemaBookingApp.Repositories.Interfaces;

namespace CinemaBookingApp.Repositories.Implementations
{
    public class MovieActorRepository : IMovieActorRepository
    {
        private readonly AppDbContext _context;

        public MovieActorRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddRangeAsync (IEnumerable<MovieActor> movieActors)
        {
            _context.MovieActor.AddRange(movieActors);
            await _context.SaveChangesAsync();
        }
    }
}
