using CinemaBookingApp.Data;
using CinemaBookingApp.Models.Entities;
using CinemaBookingApp.Repositories.Interfaces;

namespace CinemaBookingApp.Repositories.Implementations
{
    public class ShowingTimeRepository : IShowingTimeRepository
    {
        private readonly AppDbContext _context;

        public ShowingTimeRepository(AppDbContext context) { 
            _context = context;
        }

        public async Task<ShowingTime?> GetByIdAsync(long showingTimeId)
        {

            return await _context.ShowingTime.FindAsync(showingTimeId);
        }
    }
}
