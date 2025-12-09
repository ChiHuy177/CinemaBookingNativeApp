using CinemaBookingApp.Models.DTOs;
using CinemaBookingApp.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static CinemaBookingApp.Models.DTOs.Review;

namespace CinemaBookingApp.Controllers
{
    [Route("api/review")]
    [ApiController]
    [Authorize]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewController(IReviewService reviewService) { 
            _reviewService = reviewService;
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<string>>> Add(ReviewCreateDTO dto)
        {
            var result = await _reviewService.AddAsync(dto);

            return Ok(ApiResponse<string>.Success(result));
        }
    }
}
