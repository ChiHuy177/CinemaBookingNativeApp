using CinemaBookingApp.Models.Entities;
using static CinemaBookingApp.Models.DTOs.Ticket;

namespace CinemaBookingApp.Repositories.Interfaces
{
    public interface ITicketRepository
    {
        Task<Ticket> AddAsync(Ticket Ticket);


        Task<ICollection<MyTicketDTO>> GetAllAsync();

        Task<Ticket?> GetByIdAsync(long ticketId);

        Task MarkTicketAsUsed(Ticket ticket);

        Task<Ticket?> GetByTicketCodeAsync(string ticketCode);
    }
}
