using CinemaBookingApp.Models.Entities;

namespace CinemaBookingApp.Repositories.Interfaces
{
    public interface IClientRepository
    {
        Task AddAsync(Client client);

        Task<Client?> GetByEmailAsync(string email);

        Task UpdateAsync(Client client);

        Task<ICollection<Client>> GetAllAsync();

        Task<double> GetLoyalPointsAsync(string email);

        Task UpdateLoyalPointsAndRankAsync(double loyalPointsUsed, Client client, double totalPrice);

      
    }
}
