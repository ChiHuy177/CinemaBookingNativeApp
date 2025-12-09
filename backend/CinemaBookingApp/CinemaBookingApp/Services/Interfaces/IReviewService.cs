using static CinemaBookingApp.Models.DTOs.Review;

namespace CinemaBookingApp.Services.Interfaces
{
    public interface IReviewService
    {
        Task<string> AddAsync(ReviewCreateDTO dto);
    }
}
