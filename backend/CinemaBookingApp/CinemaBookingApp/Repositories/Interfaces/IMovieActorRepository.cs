using CinemaBookingApp.Models.Entities;

namespace CinemaBookingApp.Repositories.Interfaces
{
    public interface IMovieActorRepository
    {
        Task AddRangeAsync(IEnumerable<MovieActor> movieActors);
    }
}
