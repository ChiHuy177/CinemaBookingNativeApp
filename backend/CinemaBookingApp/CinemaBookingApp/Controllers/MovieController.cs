using CinemaBookingApp.Models.DTOs;
using CinemaBookingApp.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using static CinemaBookingApp.Models.DTOs.Movie;

namespace CinemaBookingApp.Controllers
{
    [Route("api/movie")]
    [ApiController]
    [Authorize]
    public class MovieController : ControllerBase
    {

        private readonly IMovieService _movieService;
        private readonly IWebHostEnvironment _environment;

        public MovieController(IMovieService movieService, IWebHostEnvironment environment) { 

            _movieService = movieService;
            _environment = environment;
        }


        [HttpGet]
        public async Task<ActionResult<ApiResponse<List<MovieDTO>>>> GetAll()
        {
            var result = await _movieService.GetAllAsync();

            return ApiResponse<List<MovieDTO>>.Success(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<MovieDTO>>> GetMovieById(long id)
        {
            var result = await _movieService.GetByIdAsync(id);
            return ApiResponse<MovieDTO>.Success(result);
        }

        [HttpGet("detail/{id}")]
        public async Task<ActionResult<ApiResponse<MovieDetailHomeDTO>>> GetMovieDetailById(long id)
        {
            var result = await _movieService.GetAsMovieDetailHomeAsync(id);
            return ApiResponse<MovieDetailHomeDTO>.Success(result);
        }

        [HttpGet("byCinema")]
        public async Task<ActionResult<ApiResponse<ICollection<MovieSearchDTO>>>> GetMoviesByCinemaId([FromQuery] long cinemaId, [FromQuery] DateTime date)
        {
            var result = await _movieService.GetMoviesByCinemaIdAsync(cinemaId,date);

            return Ok(ApiResponse<ICollection<MovieSearchDTO>>.Success(result));
        }

        [HttpPost]
        public async Task<ActionResult<ApiResponse<MovieDTO>>> CreateMovie([FromForm] CreateMovieDTO dto, [FromForm] IFormFile? posterFile)
        {

            if (posterFile != null && posterFile.Length > 0)
            {
                var fileName = await SavePosterFile(posterFile);
                dto.PosterURL = fileName; 
            }

            var result = await _movieService.CreateAsync(dto);

            return ApiResponse<MovieDTO>.Success(result);
        }

        [HttpPut("{id}")]
        [Authorize(Roles ="ADMIN")]
        public async Task<ActionResult<ApiResponse<string>>> UpdateMovie(long id, [FromForm] UpdateMovieDTO dto, [FromForm] IFormFile? posterFile)
        {

            if (posterFile != null && posterFile.Length > 0)
            {
                var fileName = await SavePosterFile(posterFile);
                dto.PosterURL = fileName; 
            }

            var result = await _movieService.UpdateAsync(id, dto);

            return ApiResponse<string>.Success(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "ADMIN")]
        public async Task<ActionResult<ApiResponse<string>>> DeleteMovie(long id)
        {
            var result = await _movieService.DeleteAsync(id);
            return ApiResponse<string>.Success(result);
        }

        [HttpPost("{id}/addFavorite")]
        public async Task<ActionResult<ApiResponse<long>>> AddFavoriteMovie(long id)
        {
            var result = await _movieService.AddFavoriteMovieAsync(id);

            return ApiResponse<long>.Success(result);
        }

        [HttpPost("{id}/removeFavorite")]
        public async Task<ActionResult<ApiResponse<long>>> RemoveFavoriteMovie(long id)
        {
            var result = await _movieService.RemoveFavoriteMovieAsync(id);

            return ApiResponse<long>.Success(result);
        }

        [HttpGet("search")]
        public async Task<ActionResult<ApiResponse<List<MovieSearchDTO>>>> SearchMovieByNameAndGenre([FromQuery] string? value = "")
        {
            var result = await _movieService.SearchMovieByNameAndGenreAsync(value ?? "");
            return Ok(ApiResponse<List<MovieSearchDTO>>.Success(result));
        }


        [HttpGet("mainHome")]
        public async Task<ActionResult<ApiResponse<List<MovieMainHomeDTO>>>> GetAllAsMovieMainHome()
        {
            var result = await _movieService.GetAllAsMovieMainHomeAsync();
            return Ok(ApiResponse<List<MovieMainHomeDTO>>.Success(result));
        }

        [HttpGet("favoriteMovies")]
        public async Task<ActionResult<ApiResponse<List<FavoriteMovieDTO>>>> FavoriteMovies()
        {
            var result = await _movieService.FavoriteMoviesAsync();
            return Ok(ApiResponse<List<FavoriteMovieDTO>>.Success(result));
        }

        // Helper method để lưu file poster
        private async Task<string> SavePosterFile(IFormFile file)
        {
            var uploadsFolder = Path.Combine(_environment.WebRootPath, "images", "posters");
            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(uploadsFolder);
            }
            var fileExtension = Path.GetExtension(file.FileName);
            var fileName = $"{Guid.NewGuid()}_{DateTime.Now:yyyyMMddHHmmss}{fileExtension}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            return fileName;
        }
    }
}
