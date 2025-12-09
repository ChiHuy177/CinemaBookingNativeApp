using CinemaBookingApp.Models.DTOs;
using CinemaBookingApp.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static CinemaBookingApp.Models.DTOs.Client;

namespace CinemaBookingApp.Controllers
{
    [Route("api/client")]
    [ApiController]
    public class ClientController : ControllerBase
    {
        private readonly IClientService _clientService;

        public ClientController(IClientService clientService) { 
            _clientService = clientService;
        }

        [HttpGet]
        [Authorize(Roles = "ADMIN, CLIENT")]
        public async Task<ActionResult<ApiResponse<ClientProfileDTO>>> GetClientByEmail()
        {
            var result = await _clientService.GetByEmailAsync();
            return Ok(ApiResponse<ClientProfileDTO>.Success(result));
        }

        [HttpPut]
        [Authorize(Roles = "CLIENT")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<ApiResponse<string>>> UpdateClient([FromForm] EditClientProfileDTO dto, [FromForm] IFormFile avatarFile)
        {
     
            var result = await _clientService.UpdateAsync(dto, avatarFile);
            return Ok(ApiResponse<string>.Success(result));
        }


        [HttpPut("changePassword")]
        [Authorize(Roles = "CLIENT")]
        public async Task<ActionResult<ApiResponse<string>>> ChangePassword([FromBody] ChangePasswordClientDTO dto)
        {
            var result = await _clientService.ChangePasswordAsync(dto);

            return Ok(ApiResponse<string>.Success(result));
        }

        [HttpGet("loyalPoints/{email}")]
        [Authorize(Roles = "CLIENT, ADMIN")]
        public async Task<ActionResult<ApiResponse<double>>> GetLoyalPoints(string email)
        {
            var result = await _clientService.GetLoyalPointsAsync(email);

            return Ok(ApiResponse<double>.Success(result));
        }
    }
}
