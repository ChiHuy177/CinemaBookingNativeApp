using CinemaBookingApp.Data;
using CinemaBookingApp.Models.Entities;
using CinemaBookingApp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaBookingApp.Repositories.Implementations
{
    public class CouponUserRepository : ICouponUserRepository
    {
        private readonly AppDbContext _context;

        public CouponUserRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddRangeAsync(IEnumerable<CouponUser> couponUsers)
        {
            _context.CouponUser.AddRange(couponUsers);

            await _context.SaveChangesAsync();
        }

        public async Task<List<CouponUser>> GetAllAsync(long clientId)
        {
            var couponUsers = await _context.CouponUser.Where(cu => !cu.IsUsed && cu.Coupon.ExpiryDate >= DateTime.Now && cu.ClientId == clientId).Include(cu => cu.Coupon).ToListAsync();

            return couponUsers;
        }

        public async Task<CouponUser?> GetByIdAndClientIdAsync(long couponId,long clientId)
        {
            var couponUser = await _context.CouponUser.FirstOrDefaultAsync(cu => cu.CouponId == couponId && cu.ClientId == clientId);

            return couponUser;
        }
    }
}
