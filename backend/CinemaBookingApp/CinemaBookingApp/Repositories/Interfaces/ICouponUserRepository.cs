using CinemaBookingApp.Models.Entities;

namespace CinemaBookingApp.Repositories.Interfaces
{
    public interface ICouponUserRepository
    {
        Task AddRangeAsync(IEnumerable<CouponUser> couponUsers);

        Task<List<CouponUser>> GetAllAsync(long clientId);

        Task<CouponUser?> GetByIdAndClientIdAsync(long couponId, long clientId);
        
    }
}
