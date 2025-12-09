using static CinemaBookingApp.Models.DTOs.MovieActor;

namespace CinemaBookingApp.Services.Interfaces
{
    public interface IMovieActorService
    {
        Task AddRangeAsync(IEnumerable<CreateMovieActorDTO> dto, long movieID);
    }
}
