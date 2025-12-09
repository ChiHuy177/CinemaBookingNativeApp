using static CinemaBookingApp.Models.DTOs.Rank;

namespace CinemaBookingApp.Services.Interfaces
{
    public interface IRankService
    {
        Task<ClientRankDTO> GetRankByEmailClientAsync(string clientEmail);
    }
}
