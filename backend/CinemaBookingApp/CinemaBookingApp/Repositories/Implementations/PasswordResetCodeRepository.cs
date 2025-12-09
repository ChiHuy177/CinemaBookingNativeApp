using CinemaBookingApp.Data;
using CinemaBookingApp.Models.Entities;
using CinemaBookingApp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaBookingApp.Repositories.Implementations
{
    public class PasswordResetCodeRepository : IPasswordResetCodeRepository
    {
        private readonly AppDbContext _context;


        public PasswordResetCodeRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(PasswordResetCode code)
        {
            _context.PasswordResetCode.Add(code);
            await _context.SaveChangesAsync();
        }

        public async Task<PasswordResetCode?> GetByEmailAsync(string email)
        {
            var prc = await _context.PasswordResetCode.FirstOrDefaultAsync(prc => prc.Email == email);

            return prc;
        }

        public async Task DeleteAsync(PasswordResetCode passwordResetCode)
        {
            _context.PasswordResetCode.Remove(passwordResetCode);
            await _context.SaveChangesAsync();
        }

        public async Task<PasswordResetCode?> GetByCodeAndEmailAsync(string code,string email)
        {
            var prc = await _context.PasswordResetCode.FirstOrDefaultAsync(prc => prc.Code == code && prc.Email == email);
            return prc;
        }
    }
}
