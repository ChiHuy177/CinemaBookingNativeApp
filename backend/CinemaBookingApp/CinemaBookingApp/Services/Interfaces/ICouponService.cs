using static CinemaBookingApp.Models.DTOs.Coupon;

namespace CinemaBookingApp.Services.Interfaces
{
    public interface ICouponService
    {
        Task<string> AddAsync(CouponCreateDTO dto);

        Task<List<CouponDTO>> GetAllAsync(string clientEmail);

    }
}
