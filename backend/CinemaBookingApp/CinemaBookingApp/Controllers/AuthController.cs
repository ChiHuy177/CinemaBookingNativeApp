
using CinemaBookingApp.Models.DTOs;
using CinemaBookingApp.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static CinemaBookingApp.Models.DTOs.Login;
using static CinemaBookingApp.Models.DTOs.Register;
using static CinemaBookingApp.Models.DTOs.ResetPasswordCode;

namespace CinemaBookingApp.Controllers
{

    [Route("api/auth")]
    [ApiController]
    [AllowAnonymous]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<ApiResponse<string>>> Register([FromBody] RegisterRequestDTO dto)
        {

            var result = await _authService.RegisterAsync(dto, Request.Scheme);

            return Ok(ApiResponse<string>.Success(result));
        }

        [HttpGet("confirm-email")]
        public async Task<ActionResult<ApiResponse<string>>> ConfirmEmail(string userId, string token)
        {
           
            var result = await _authService.ConfirmEmailAsync(userId, token);

            return Ok(ApiResponse<string>.Success(result));
        }


        [HttpPost("login")]
        public async Task<ActionResult<ApiResponse<LoginResponseDTO>>> Login([FromBody] LoginRequestDTO dto)
        {
            
            var result = await _authService.LoginAsync(dto);

            return Ok(ApiResponse<LoginResponseDTO>.Success(result));
        }


        [HttpPost("sendResetPasswordCode")]
        public async Task<ActionResult<ApiResponse<string>>> SendResetPasswordCode([FromBody] string email)
        {
            var result = await _authService.SendResetPasswordCodeAsync(email);
            return Ok(ApiResponse<string>.Success(result));
        }



        [HttpPost("resendResetPasswordCode")]
        public async Task<ActionResult<ApiResponse<string>>> ResendResetPasswordCode([FromBody] string email)
        {
            var result = await _authService.ResendResetPasswordCodeAsync(email);
            return Ok(ApiResponse<string>.Success(result));
        }

        [HttpPost("resetPassword")]
        public async Task<ActionResult<ApiResponse<string>>> ResetPasswordByCode([FromBody] ResetPasswordCodeRequestDTO dto)
        {
            var result = await _authService.ResetPasswordByCodeAsync(dto);
            return Ok(ApiResponse<string>.Success(result));
        }
    }
}
