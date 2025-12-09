using CinemaBookingApp.Models.DTOs;
using CinemaBookingApp.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static CinemaBookingApp.Models.DTOs.Rank;

namespace CinemaBookingApp.Controllers
{
    [Route("api/rank")]
    [Authorize]
    public class RankController : ControllerBase
    {
        private readonly IRankService _rankService;

        public RankController(IRankService rankService)
        {
            _rankService = rankService;
        }

        [HttpGet("client/{clientEmail}")]
        public async Task<ActionResult<ApiResponse<ClientRankDTO>>> GetRankByEmailClient(string clientEmail)
        {
            var result = await _rankService.GetRankByEmailClientAsync(clientEmail);

            return Ok(ApiResponse<ClientRankDTO>.Success(result));
        }
    }
}
