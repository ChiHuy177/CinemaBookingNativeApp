using CinemaBookingApp.Models.Entities;
using static CinemaBookingApp.Models.DTOs.Combo;

namespace CinemaBookingApp.Repositories.Interfaces
{
    public interface IComboRepository
    {
        Task<ICollection<Combo>> GetAllAsync();

        Task<ICollection<UnAvailableComboDTO>> GetUnavailableCombosForBookingAsync(ICollection<ComboInTicketDTO> combos);

        Task ReduceQuantityCombosAsync(ICollection<ComboInTicketDTO> combos);
    }
}
