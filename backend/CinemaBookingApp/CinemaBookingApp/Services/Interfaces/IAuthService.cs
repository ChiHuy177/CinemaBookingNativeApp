using CinemaBookingApp.Helpers.Validators.Auth;
using CinemaBookingApp.Models.DTOs;
using static CinemaBookingApp.Models.DTOs.Login;
using static CinemaBookingApp.Models.DTOs.Register;
using static CinemaBookingApp.Models.DTOs.ResetPasswordCode;

namespace CinemaBookingApp.Services.Interfaces
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(RegisterRequestDTO dto, string requestScheme);
        Task<string> ConfirmEmailAsync(string userId, string token);
        Task<LoginResponseDTO> LoginAsync(LoginRequestDTO dto);

        Task<string> SendResetPasswordCodeAsync(string email);

        Task<string> ResendResetPasswordCodeAsync(string email);

        Task<string> ResetPasswordByCodeAsync(ResetPasswordCodeRequestDTO dto);
    }

}
