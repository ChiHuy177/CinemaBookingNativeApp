using CinemaBookingApp.Excecptions;
using CinemaBookingApp.Repositories.Interfaces;
using CinemaBookingApp.Services.Interfaces;
using static CinemaBookingApp.Models.DTOs.Seat;

namespace CinemaBookingApp.Services.Implementations
{
    public class SeatService : ISeatService
    {
        private readonly ISeatRepository _seatRepository;
        private readonly IShowingTimeRepository _showingTimeRepository;

        public SeatService(ISeatRepository seatRepository,IShowingTimeRepository showingTimeRepository) { 
            _seatRepository = seatRepository;
            _showingTimeRepository = showingTimeRepository;
        }

        public async Task<ICollection<SeatRowForBookingDTO>> GetSeatsForBookingAsync(long showingTimeId)
        {

            var showingTime = await _showingTimeRepository.GetByIdAsync(showingTimeId);

            if(showingTime == null)
            {
                throw new ApiException(ErrorCode.NOT_FOUND);
            }

            var seats = await _seatRepository.GetSeatsForBookingAsync(showingTimeId);

            return seats;
        }
    }
}
