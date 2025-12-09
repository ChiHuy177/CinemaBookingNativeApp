using CinemaBookingApp.Data;
using CinemaBookingApp.Excecptions;
using CinemaBookingApp.Models.Entities;
using CinemaBookingApp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaBookingApp.Repositories.Implementations
{
    public class ClientRepository : IClientRepository
    {
        private readonly AppDbContext _context;
        private readonly IRankRepository _rankRepository;

        public ClientRepository(AppDbContext context, IRankRepository rankRepository)
        {
            _context = context;
            _rankRepository = rankRepository;
        }

        public async Task AddAsync(Client client)
        {
            _context.Client.Add(client);

            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Client client)
        {
            _context.Client.Update(client);
            await _context.SaveChangesAsync();
        }

        public async Task<Client?> GetByEmailAsync(string email)
        {
            return await _context.Client.Include(c => c.Rank).FirstOrDefaultAsync(c => c.Email == email);
        }

        public async Task<ICollection<Client>> GetAllAsync()
        {
            return await _context.Client.ToListAsync();
        }

        public async Task<double> GetLoyalPointsAsync(string email)
        {
            var client = await GetByEmailAsync(email);

            if(client == null)
            {
                throw new ApiException(ErrorCode.NOT_FOUND);
            }

            return client.LoyalPoints;
        }

        public async Task UpdateLoyalPointsAndRankAsync(double loyalPointsUsed,Client client,double totalPrice)
        {
            client.LoyalPoints -= loyalPointsUsed;

            client.LoyalPoints += Math.Round(totalPrice / 100);

            var ranks = await _rankRepository.GetAllAsync();

            for (int i = ranks.Count() - 1; i >= 0; i--)
            {
                if (client.LoyalPoints >= ranks[i].RequirePoint)
                {
                    client.RankId = ranks[i].RankId;
                }
            }

            await _context.SaveChangesAsync();
        }

    }
}
