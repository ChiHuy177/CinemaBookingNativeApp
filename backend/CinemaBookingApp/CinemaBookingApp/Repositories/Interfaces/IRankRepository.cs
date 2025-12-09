using CinemaBookingApp.Models.Entities;
using static CinemaBookingApp.Models.DTOs.Rank;

namespace CinemaBookingApp.Repositories.Interfaces
{
    public interface IRankRepository
    {
        Task<List<Rank>> GetAllAsync();

        Task<Rank?> GetRankByEmailClientAsync(string clientEmail);

    }
}
