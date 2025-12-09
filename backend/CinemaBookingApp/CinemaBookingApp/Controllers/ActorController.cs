using CinemaBookingApp.Models.DTOs;
using CinemaBookingApp.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static CinemaBookingApp.Models.DTOs.Actor;

namespace CinemaBookingApp.Controllers
{
    [Route("/api/actor")]
    [ApiController]
    [Authorize]
    public class ActorController : ControllerBase
    {
        private readonly IActorService _actorService;

        public ActorController(IActorService actorService) {
            _actorService = actorService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<ActorDTO>>>> GetAllActors()
        {
            var actors = await _actorService.GetAllAsync();
            return Ok(ApiResponse<List<ActorDTO>>.Success(actors));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<string>>> AddActor([FromBody] CreateActorDTO dto)
        {
            var result = await _actorService.AddAsync(dto);
            return Ok(ApiResponse<string>.Success(result));
        }
    }
}
