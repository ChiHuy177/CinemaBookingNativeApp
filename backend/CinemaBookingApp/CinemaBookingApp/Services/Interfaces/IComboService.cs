using static CinemaBookingApp.Models.DTOs.Combo;

namespace CinemaBookingApp.Services.Interfaces
{
    public interface IComboService
    {
        Task<ICollection<ComboDTO>> GetAllAsync();
    }
}
