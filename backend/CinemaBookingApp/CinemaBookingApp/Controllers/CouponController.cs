using CinemaBookingApp.Models.DTOs;
using CinemaBookingApp.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static CinemaBookingApp.Models.DTOs.Coupon;

namespace CinemaBookingApp.Controllers
{

    [Route("api/coupon")]
    [ApiController]
    [Authorize]
    public class CouponController : ControllerBase
    {
        private readonly ICouponService _couponService;

        public CouponController(ICouponService couponService)
        {
            _couponService = couponService;
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<string>>> Add(CouponCreateDTO dto)
        {
            var result = await _couponService.AddAsync(dto);

            return Ok(ApiResponse<string>.Success(result));
        }

        [HttpGet("{clientEmail}")]
        public async Task<ActionResult<ApiResponse<List<CouponDTO>>>> GetAll(string clientEmail)
        {
            var result = await _couponService.GetAllAsync(clientEmail);
            return Ok(ApiResponse<List<CouponDTO>>.Success(result));
        }

    }
}
