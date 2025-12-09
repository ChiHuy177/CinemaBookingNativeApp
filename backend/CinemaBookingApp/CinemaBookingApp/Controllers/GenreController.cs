using AutoMapper;
using CinemaBookingApp.Models.DTOs;
using CinemaBookingApp.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static CinemaBookingApp.Models.DTOs.Genre;

namespace CinemaBookingApp.Controllers
{
    [ApiController]
    [Route("api/genre")]
    [Authorize]
    public class GenreController : Controller
    {
        private readonly IGenreService _genreService;

        public GenreController(IGenreService genreService)
        {
            _genreService = genreService;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<GenreDTO>>>> GetAllGenres()
        {
            var genres = await _genreService.GetAllAsync();
            return Ok(ApiResponse<List<GenreDTO>>.Success(genres));
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<GenreDTO>>> GetGenreById(long id)
        {
            var genre = await _genreService.GetByIdAsync(id);

            return Ok(ApiResponse<GenreDTO>.Success(genre));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<GenreDTO>>> CreateGenre([FromBody] CreateGenreDTO request)
        {

            var createdGenre = await _genreService.CreateAsync(request);
            return CreatedAtAction(nameof(GetGenreById), new { id = createdGenre.GenreId }, ApiResponse<GenreDTO>.Success(createdGenre));

        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ApiResponse<string>>> UpdateGenre(long id,[FromBody] UpdateGenreDTO request)
        {
            var result = await _genreService.UpdateAsync(id,request);
            return Ok(ApiResponse<string>.Success(result));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResponse<string>>> DeleteGenre(long id)
        {
           var resultt =  await _genreService.DeleteAsync(id);
            return Ok(ApiResponse<string>.Success(resultt));
        }
    }
}
