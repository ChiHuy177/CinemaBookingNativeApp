using CinemaBookingApp.Models.Entities;

namespace CinemaBookingApp.Repositories.Interfaces
{
    public interface IPasswordResetCodeRepository
    {
        Task AddAsync(PasswordResetCode code);

        Task<PasswordResetCode?> GetByEmailAsync(string email);

        Task DeleteAsync(PasswordResetCode passwordResetCode);

        Task<PasswordResetCode?> GetByCodeAndEmailAsync(string code,string email);
    }
}
