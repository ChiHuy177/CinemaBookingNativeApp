using static CinemaBookingApp.Models.DTOs.Ticket;

namespace CinemaBookingApp.Services.Interfaces
{
    public interface ITicketService
    {
        Task<ICollection<MyTicketDTO>> GetAllAsync();

        Task<TicketCheckingDTO> AddAsync(CreateTicketDTO dto);

        Task<TicketDTO> GetByIdAsync(long ticketId);

        Task<bool> VerifyTicketAsync(string ticketCode);
    }
}
