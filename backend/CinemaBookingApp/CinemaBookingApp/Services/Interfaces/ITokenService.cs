using CinemaBookingApp.Models.Entities;
using Microsoft.AspNetCore.Identity;

namespace CinemaBookingApp.Services.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(Client client, IList<string> roles);
    }
}
