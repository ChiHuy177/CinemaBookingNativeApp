using static CinemaBookingApp.Models.DTOs.Actor;

namespace CinemaBookingApp.Services.Interfaces
{
    public interface IActorService
    {
        Task<List<ActorDTO>> GetAllAsync();
        Task<string> AddAsync(CreateActorDTO dto);
    }
}
