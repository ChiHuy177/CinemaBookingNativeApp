using CinemaBookingApp.Models.Entities;

namespace CinemaBookingApp.Repositories.Interfaces
{
    public interface ITicketSeatRepository
    {
        Task AddRangeAsync(ICollection<TicketSeat> ticketSeats);
    }
}
