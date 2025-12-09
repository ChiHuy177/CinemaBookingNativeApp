using CinemaBookingApp.Data;
using CinemaBookingApp.Models.Entities;
using CinemaBookingApp.Repositories.Interfaces;

namespace CinemaBookingApp.Repositories.Implementations
{
    public class ComboTicketRepository : IComboTicketRepository
    {
        private readonly AppDbContext _context;

        public ComboTicketRepository(AppDbContext context) { 
            _context = context;
        }

        public async Task AddRangeAsync(ICollection<ComboTicket> comboTickets)
        {
            _context.ComboTicket.AddRange(comboTickets);

            await _context.SaveChangesAsync();
        }
    }
}
