using static CinemaBookingApp.Models.DTOs.Client;

namespace CinemaBookingApp.Services.Interfaces
{
    public interface IClientService
    {

        Task<ClientProfileDTO> GetByEmailAsync();

        Task<string> UpdateAsync(EditClientProfileDTO dto,IFormFile avatarFile);

        Task<string> ChangePasswordAsync(ChangePasswordClientDTO dto);


        Task<double> GetLoyalPointsAsync(string email);

    }
}
