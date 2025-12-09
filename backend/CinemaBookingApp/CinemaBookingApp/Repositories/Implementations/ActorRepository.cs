using CinemaBookingApp.Data;
using CinemaBookingApp.Models.Entities;
using CinemaBookingApp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaBookingApp.Repositories.Implementations
{
    public class ActorRepository : IActorRepository
    {
        private readonly AppDbContext _context;

        public ActorRepository(AppDbContext context) { 
            _context = context;
        }

        public async Task<List<Actor>> GetAllAsync()
        {
            return await _context.Actor.ToListAsync();
        }

        public async Task AddAsync(Actor actor)
        {
            _context.Actor.Add(actor);
            await _context.SaveChangesAsync();
        }
    }
}
