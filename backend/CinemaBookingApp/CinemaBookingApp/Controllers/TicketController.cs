using CinemaBookingApp.Models.DTOs;
using CinemaBookingApp.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static CinemaBookingApp.Models.DTOs.Ticket;

namespace CinemaBookingApp.Controllers
{
    [Route("api/ticket")]
    [ApiController]
    [Authorize]
    public class TicketController : ControllerBase
    {
        private readonly ITicketService _ticketService;

        public TicketController(ITicketService ticketService)
        {
            _ticketService = ticketService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<ICollection<MyTicketDTO>>>> GetAll()
        {
            var result = await _ticketService.GetAllAsync();

            return Ok(ApiResponse<ICollection<MyTicketDTO>>.Success(result));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<TicketCheckingDTO>>> Add([FromBody] CreateTicketDTO dto)
        {
 
            var result = await _ticketService.AddAsync(dto);

            return Ok(ApiResponse<TicketCheckingDTO>.Success(result));
        }

        [HttpGet("{ticketId}")]
        public async Task<ActionResult<ApiResponse<TicketDTO>>> GetById(long ticketId)
        {
            var result = await _ticketService.GetByIdAsync(ticketId);
            return Ok(ApiResponse<TicketDTO>.Success(result));
        }

        [HttpGet("verify/{ticketCode}")]
        [Authorize(Roles ="ADMIN, STAFF")]
        public async Task<ActionResult<ApiResponse<bool>>> VerifyTicket(string ticketCode)
        {
            var result = await _ticketService.VerifyTicketAsync(ticketCode);

            return Ok(ApiResponse<bool>.Success(result));
        }
    }
}
