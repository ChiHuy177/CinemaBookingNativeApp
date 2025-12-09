

using CinemaBookingApp.Models.Entities;

namespace CinemaBookingApp.Repositories.Interfaces
{
    public interface IReviewRepository
    {
        Task AddAsync(Review review);
    }
}
