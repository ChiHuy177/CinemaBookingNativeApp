using AutoMapper;
using CinemaBookingApp.Data;
using CinemaBookingApp.Models.Entities;
using CinemaBookingApp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using static CinemaBookingApp.Models.DTOs.Rank;

namespace CinemaBookingApp.Repositories.Implementations
{
    public class RankRepository : IRankRepository
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public RankRepository(AppDbContext context,IMapper mapper) { 
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<Rank>> GetAllAsync()
        {
            var ranks = await _context.Rank.ToListAsync();

            return ranks;
        }

        public async Task<Rank?> GetRankByEmailClientAsync(string clientEmail)
        {
            var rank = await _context.Rank.FirstOrDefaultAsync(r => r.Clients.Any(c => c.Email == clientEmail));

            return rank;
        }
    }
}
