using CinemaBookingApp.Data;
using CinemaBookingApp.Models.Entities;
using CinemaBookingApp.Repositories.Interfaces;

namespace CinemaBookingApp.Repositories.Implementations
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly AppDbContext _context;

        public ReviewRepository(AppDbContext context) { 
            _context = context;
        }

        public async Task AddAsync(Review review)
        {
            _context.Review.Add(review);
            await _context.SaveChangesAsync();
        }
    }
}
