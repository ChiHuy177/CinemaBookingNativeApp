using AutoMapper;
using CinemaBookingApp.Excecptions;
using CinemaBookingApp.Models.Entities;
using CinemaBookingApp.Repositories.Interfaces;
using CinemaBookingApp.Services.Interfaces;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using static CinemaBookingApp.Models.DTOs.Client;

namespace CinemaBookingApp.Services.Implementations
{
    public class ClientService : IClientService
    {
        private readonly IClientRepository _clientRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMapper _mapper;
        private readonly UserManager<IdentityUser> _userManager;

        public ClientService(IClientRepository clientRepository, IHttpContextAccessor httpContextAccessor, IMapper mapper, UserManager<IdentityUser> userManager)
        {
            _clientRepository = clientRepository;
            _httpContextAccessor = httpContextAccessor;
            _mapper = mapper;
            _userManager = userManager;
        }


        public async Task<double> GetLoyalPointsAsync(string email)
        {
            string clientEmail = GetClientEmailFromClaims();

            if(clientEmail != email)
            {
                throw new ApiException(ErrorCode.UNAUTHORIZED);
            }

            var result = await _clientRepository.GetLoyalPointsAsync(email);

            return result;
        }


        public async Task<ClientProfileDTO> GetByEmailAsync()
        {
            var clientEmail = GetClientEmailFromClaims();
            var client = await _clientRepository.GetByEmailAsync(clientEmail);

            if(client == null)
            {
                throw new ApiException(ErrorCode.NOT_FOUND);
            }

            var result = _mapper.Map<ClientProfileDTO>(client);

            return result;
        }

        public async Task<string> UpdateAsync(EditClientProfileDTO dto,IFormFile avatarFile)
        {
            var clientEmail = GetClientEmailFromClaims();

            var client = await _clientRepository.GetByEmailAsync(clientEmail);
            if (client == null)
            {
 
                throw new ApiException(ErrorCode.NOT_FOUND);
            }
            Console.WriteLine(avatarFile);

            if(avatarFile == null || avatarFile.Length == 0)
            {
      
                throw new ApiException(ErrorCode.BAD_REQUEST);
            }

            _mapper.Map(dto, client);

            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/clients");
            var originalFileName = avatarFile.FileName;


            if (!string.Equals(originalFileName, client.Avatar, StringComparison.OrdinalIgnoreCase))
            {
                var filePath = Path.Combine(uploadsFolder, originalFileName);

                string finalFileName;
                if (System.IO.File.Exists(filePath))
                {
                    finalFileName = Guid.NewGuid().ToString() + Path.GetExtension(avatarFile.FileName);
                    filePath = Path.Combine(uploadsFolder, finalFileName);
                }
                else
                {
                    finalFileName = originalFileName;
                }

   
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await avatarFile.CopyToAsync(stream);
                }

                if (!string.IsNullOrEmpty(client.Avatar) && client.Avatar != "default.jpg")
                {
                    var oldFile = Path.Combine(uploadsFolder, client.Avatar);
                    if (System.IO.File.Exists(oldFile))
                    {
                        System.IO.File.Delete(oldFile);
                    }
                }


                client.Avatar = finalFileName;
            }

            await _clientRepository.UpdateAsync(client);
            return "Update Successfully";          
        }

        public async Task<string> ChangePasswordAsync(ChangePasswordClientDTO dto)
        {
            var emailFromToken = GetClientEmailFromClaims();
            var emailFromRequest = dto.Email;

            if(emailFromToken == null)
            {
                throw new ApiException(ErrorCode.UNAUTHORIZED);
            }

            if(emailFromRequest != emailFromToken)
            {
                throw new ApiException(ErrorCode.UNAUTHORIZED);
            }

            var user = await _userManager.FindByEmailAsync(emailFromRequest);
            if (user == null) {
                throw new ApiException(ErrorCode.NOT_FOUND);
            }

            var result = await _userManager.ChangePasswordAsync(user, dto.CurrentPassword, dto.NewPassword);
            if (!result.Succeeded)
            {
                var failures = result.Errors.Select(e => new ValidationFailure("Identity", e.Description));
                throw new ValidationException(failures);
            }

            return "Change Password Successfully!!";

        }

        private long GetClientIdFromClaims()
        {
            var user = _httpContextAccessor.HttpContext?.User;

            var temp = user?.FindFirst("clientId")?.Value;

            if (temp == null)
            {
                throw new ApiException(ErrorCode.UNAUTHORIZED);
            }

            var clientId = long.Parse(temp);
            return clientId;
        }

        private string GetClientEmailFromClaims()
        {
            var user = _httpContextAccessor.HttpContext?.User;
            foreach (var claim in user?.Claims)
            {
                Console.WriteLine($"Claim Type: {claim.Type}, Value: {claim.Value}");
            }

            var email = user?.FindFirst(ClaimTypes.NameIdentifier)?.Value;



            if (email == null)
            {
                throw new ApiException(ErrorCode.UNAUTHORIZED);
            }


            return email;
        }

    }
}
