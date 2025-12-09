using CinemaBookingApp.Models.Entities;

namespace CinemaBookingApp.Repositories.Interfaces
{
    public interface IComboTicketRepository
    {
        Task AddRangeAsync(ICollection<ComboTicket> comboTickets);
    }
}
