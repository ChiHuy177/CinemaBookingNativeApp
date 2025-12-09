using CinemaBookingApp.Models.Entities;

namespace CinemaBookingApp.Repositories.Interfaces
{
    public interface IActorRepository
    {
        Task<List<Actor>> GetAllAsync();
        Task AddAsync(Actor actor);
    }
}
