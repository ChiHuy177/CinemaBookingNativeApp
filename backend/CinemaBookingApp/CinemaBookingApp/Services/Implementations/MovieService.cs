

using AutoMapper;
using CinemaBookingApp.Excecptions;
using CinemaBookingApp.Models.Entities;
using CinemaBookingApp.Repositories.Interfaces;
using CinemaBookingApp.Services.Interfaces;
using System.Security.Claims;
using static CinemaBookingApp.Models.DTOs.Movie;

namespace CinemaBookingApp.Services.Implementations
{
    public class MovieService : IMovieService
    {
        private readonly IMovieRepository _repository;
        private readonly IGenreMovieService _genreMovieService;
        private readonly IMovieActorService _movieActorService;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public MovieService(IMapper mapper, IMovieRepository repository, IHttpContextAccessor httpContextAccessor,IGenreMovieService genreMovieService,IMovieActorService movieActorService)
        {
            _mapper = mapper;
            _repository = repository;
            _httpContextAccessor = httpContextAccessor;
            _genreMovieService = genreMovieService;
            _movieActorService = movieActorService;
        }

        public async Task<MovieDTO> CreateAsync(CreateMovieDTO dto)
        {
            Movie movie = _mapper.Map<Movie>(dto);

            movie = await _repository.AddAsync(movie);

            await _genreMovieService.AddRangeAsync(dto.GenreIDs, movie.MovieId);
            await _movieActorService.AddRangeAsync(dto.CreateMovieActorDTOs, movie.MovieId);

            return _mapper.Map<MovieDTO>(movie);
 
        }

        public async Task<string> DeleteAsync(long id)
        {
            var movie = await _repository.GetByIdAsync(id);
            if(movie == null)
            {
                throw new ApiException(ErrorCode.NOT_FOUND);
            }

            await _repository.DeleteAsync(movie);
            return "Delete Successfully!!";
        }

        public async Task<List<MovieDTO>> GetAllAsync()
        {
            var movies = await _repository.GetAllAsync();
            return _mapper.Map<List<MovieDTO>>(movies);
        }

        public async Task<ICollection<MovieSearchDTO>> GetMoviesByCinemaIdAsync(long cinemaId,DateTime date)
        {
            var clientId = GetClientIdFromClaims();
            
            var result = await _repository.GetMoviesByCinemaIdAsync(cinemaId, clientId,date);

            return result;
        }
        public async Task<MovieDetailHomeDTO> GetAsMovieDetailHomeAsync(long id)
        {
           var clientId = GetClientIdFromClaims();

             var movie = await _repository.GetAsMovieDetailHomeAsync(id,clientId);
            if(movie == null)
            {
                throw new ApiException(ErrorCode.NOT_FOUND);
            }

            var result = _mapper.Map<MovieDetailHomeDTO>(movie);
            return result;
        }

        public async Task<List<MovieMainHomeDTO>> GetAllAsMovieMainHomeAsync()
        {
            var movies =  await _repository.GetAllAsMovieMainHomeAsync();

            var mainHomeMovies = _mapper.Map<List<MovieMainHomeDTO>>(movies);

            return mainHomeMovies.OrderByDescending(m => m.TotalBooking).ThenByDescending(m => m.TotalLike).ToList() ;
        }

        public async Task<MovieDTO> GetByIdAsync(long id)
        {
            var movie = await _repository.GetByIdAsync(id);
            if(movie == null)
            {
                throw new ApiException(ErrorCode.NOT_FOUND);
            }

            return _mapper.Map<MovieDTO>(movie);
        }

        public async Task<string> UpdateAsync(long id ,UpdateMovieDTO dto)
        {
            var movie = await _repository.GetByIdAsync(id);
            if (movie == null)
            {
                throw new ApiException(ErrorCode.NOT_FOUND);
            }
            
            // Map DTO vào object movie hiện có (không tạo object mới)
            _mapper.Map(dto, movie);
            
            await _repository.UpdateAsync(movie);

            return "Update Successfully!!";
        }

        public async Task<long> AddFavoriteMovieAsync(long movieId)
        {
            var clientId = GetClientIdFromClaims();
           var totalLike = await _repository.AddFavoriteMovieAsync(movieId, clientId);

            return totalLike;

        }

        public async Task<long> RemoveFavoriteMovieAsync(long movieId)
        {
            var clientId = GetClientIdFromClaims();
            var totalLike = await _repository.RemoveFavoriteMovieAsync(movieId, clientId);

            return totalLike;
        }

        public async Task<List<MovieSearchDTO>> SearchMovieByNameAndGenreAsync(string value)
        {
            var clientId = GetClientIdFromClaims();
            var movies = await _repository.SearchMovieByNameAndGenreAsync(value,clientId);
            return movies;
        }

        public async Task<List<FavoriteMovieDTO>> FavoriteMoviesAsync()
        {
            var clientId = GetClientIdFromClaims();
            var result = await _repository.FavoriteMoviesAsync(clientId);
            return result;
        }

        private long GetClientIdFromClaims()
        {
            var user = _httpContextAccessor.HttpContext?.User;

            var temp = user?.FindFirst("clientId")?.Value;

            if (temp == null)
            {
                throw new ApiException(ErrorCode.UNAUTHORIZED);
            }

            var clientId = long.Parse(temp);
            return clientId;
        }
    }
}
