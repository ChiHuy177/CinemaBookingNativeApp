using CinemaBookingApp.Models.DTOs;
using CinemaBookingApp.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static CinemaBookingApp.Models.DTOs.Seat;

namespace CinemaBookingApp.Controllers
{
    [Route("api/seat")]
    [ApiController]
    [Authorize]
    public class SeatController : ControllerBase
    {
        private readonly ISeatService _seatService;

        public SeatController(ISeatService seatService) { 
            _seatService = seatService;
        }


        [HttpGet("booking/{showingTimeId}")]
        public async Task<ActionResult<ApiResponse<ICollection<SeatRowForBookingDTO>>>> GetSeatForBooking(long showingTimeId)
        {
            var result = await _seatService.GetSeatsForBookingAsync(showingTimeId);

            return Ok(ApiResponse<ICollection<SeatRowForBookingDTO>>.Success(result));
        }
    }
}
