using CinemaBookingApp.Models.DTOs;
using CinemaBookingApp.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static CinemaBookingApp.Models.DTOs.Cinema;

namespace CinemaBookingApp.Controllers
{

    [Route("api/cinema")]
    [ApiController]
    [Authorize]
    public class CinemaController : ControllerBase
    {
        private readonly ICinemaService _cinemaService;

        public CinemaController(ICinemaService cinemaService) { 
            _cinemaService = cinemaService;
        }


        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<CinemaDTO>>>> GetAll()
        {
            var result = await _cinemaService.GetAllAsync();
            return Ok(ApiResponse<List<CinemaDTO>>.Success(result));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<CinemaDTO>>> GetCinemaById(long id)
        {
            var result = await _cinemaService.GetByIdAsync(id);

            return Ok(ApiResponse<CinemaDTO>.Success(result));
        }

        [HttpGet("booking")]
        public async Task<ActionResult<ApiResponse<List<CinemaWithCityCountDTO>>>> GetAllBookingCinema()
        {
            var result = await _cinemaService.GetAllForBookingByCinemasAsync();
            return Ok(ApiResponse<List<CinemaWithCityCountDTO>>.Success(result));
        }

        [HttpGet("booking/{movieId}")]
        public async Task<ActionResult<ApiResponse<CinemaForBookingDTO>>> GetCinemaForBooking(long movieId)
        {
            var result = await _cinemaService.GetCinemasForBookingAsync(movieId);

            return Ok(ApiResponse<List<CinemaForBookingDTO>>.Success(result));
        }
    }
}
