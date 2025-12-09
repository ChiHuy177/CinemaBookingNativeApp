using CinemaBookingApp.Models.DTOs;
using CinemaBookingApp.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static CinemaBookingApp.Models.DTOs.Combo;

namespace CinemaBookingApp.Controllers
{
    [Route("api/combo")]
    [ApiController]
    [Authorize]
    public class ComboController : ControllerBase
    {
        private readonly IComboService _comboService;

        public ComboController(IComboService comboService) { 
            _comboService = comboService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<ICollection<ComboDTO>>>> GetAll()
        {
            var result = await _comboService.GetAllAsync();

            return Ok(ApiResponse<ICollection<ComboDTO>>.Success(result));
        }
    }
}
