using CinemaBookingApp.Data;
using CinemaBookingApp.Models.Entities;
using CinemaBookingApp.Repositories.Interfaces;

namespace CinemaBookingApp.Repositories.Implementations
{
    public class TicketSeatRepository: ITicketSeatRepository
    {
        private readonly AppDbContext _context;

        public TicketSeatRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddRangeAsync(ICollection<TicketSeat> ticketSeats)
        {
            _context.TicketSeat.AddRange(ticketSeats);

            await _context.SaveChangesAsync();
        }
    }
}
