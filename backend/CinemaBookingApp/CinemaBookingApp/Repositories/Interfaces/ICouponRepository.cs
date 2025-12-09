using CinemaBookingApp.Models.Entities;

namespace CinemaBookingApp.Repositories.Interfaces
{
    public interface ICouponRepository
    {
        Task AddAsync(Coupon coupon);

        Task<Coupon?> GetByIdAsync(long? couponId);
    }
}
