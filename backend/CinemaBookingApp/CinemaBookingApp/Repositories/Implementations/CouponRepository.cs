using CinemaBookingApp.Data;
using CinemaBookingApp.Models.Entities;
using CinemaBookingApp.Repositories.Interfaces;

namespace CinemaBookingApp.Repositories.Implementations
{
    public class CouponRepository : ICouponRepository
    {
        private readonly AppDbContext _context;
        private readonly IClientRepository _clientRepository;
        private readonly ICouponUserRepository _couponUserRepository;

        public CouponRepository(AppDbContext context,IClientRepository clientRepository,ICouponUserRepository couponUserRepository) { 
            _context = context;
            _clientRepository = clientRepository;
            _couponUserRepository = couponUserRepository;
        }

        public async Task AddAsync(Coupon coupon)
        {
            _context.Coupon.Add(coupon);
            await _context.SaveChangesAsync();

            var clients = await _clientRepository.GetAllAsync();

            var couponUsers = clients.Select(c => new CouponUser
            {
                ClientId = c.ClientId,
                CouponId = coupon.CouponId,
                IsUsed = false
            });

            await _couponUserRepository.AddRangeAsync(couponUsers);
        }

        public async Task<Coupon?> GetByIdAsync(long? couponId)
        {
            var coupon = await _context.Coupon.FindAsync(couponId);

            return coupon;
        }
    }
}
