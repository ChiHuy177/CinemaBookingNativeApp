using AutoMapper.QueryableExtensions;
using CinemaBookingApp.Data;
using CinemaBookingApp.Excecptions;
using CinemaBookingApp.Models.Entities;
using CinemaBookingApp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using static CinemaBookingApp.Models.DTOs.Movie;
using AutoMapper;

namespace CinemaBookingApp.Repositories.Implementationso
{
    public class MovieRepository : IMovieRepository
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;



        public MovieRepository(AppDbContext context,IMapper mapper) { 
            _context = context;
            _mapper = mapper;
        }


        public async Task<List<Movie>> GetAllAsync()
        {
            return await _context.Movie.ToListAsync();
        }

        public async Task<List<Movie>> GetAllAsMovieMainHomeAsync()
        {
            var today = DateTime.Today;
            //return await _context.Movie.Where(m => m.IsAvailable && m.ShowingTimes.Any(sw => sw.StartTime >= today)).Select(m => new Movie
            //{
            //    MovieId = m.MovieId,
            //    TotalLike = m.TotalLike,
            //    ReleaseDate = m.ReleaseDate,
            //    PosterURL = m.PosterURL,
            //    Title = m.Title,
            //    TotalBooking = m.TotalBooking,
            //}).ToListAsync();

            return await _context.Movie.Where(m => m.IsAvailable).Select(m => new Movie
            {
                MovieId = m.MovieId,
                TotalLike = m.TotalLike,
                ReleaseDate = m.ReleaseDate,
                PosterURL = m.PosterURL,
                Title = m.Title,
                TotalBooking = m.TotalBooking,
            }).ToListAsync();
        }
        
        public async Task<Movie?> GetAsMovieDetailHomeAsync(long id, long clientId)
        {
            return await _context.Movie.Include(m => m.MovieActors).ThenInclude(ma => ma.Actor).Include(m => m.Reviews).ThenInclude(r => r.Client)
                .Include(m => m.Favorites.Where(f => f.ClientId == clientId && f.MovieId == id))
                .Include(m => m.GenreMovies).ThenInclude(gm => gm.Genre)
                .FirstOrDefaultAsync(m => m.MovieId == id);
        }

        public async Task<long> AddFavoriteMovieAsync(long movieId,long clientId)
        {
            var favorite = new Favorite
            {
                ClientId = clientId,
                MovieId = movieId,
            };


            var movie = await GetByIdAsync(movieId);
            if(movie == null)
            {
                throw new ApiException(ErrorCode.NOT_FOUND);
            }
            movie.TotalLike++;
            _context.Favorite.Add(favorite);
            await _context.SaveChangesAsync();

            return movie.TotalLike;
        }

        public async Task<long> RemoveFavoriteMovieAsync(long movieId,long clientId)
        {
            var favorite = await _context.Favorite.FirstOrDefaultAsync(f => f.ClientId == clientId && f.MovieId == movieId);
            
            if (favorite == null)
            {
                throw new ApiException(ErrorCode.NOT_FOUND);
            }
            var movie = await GetByIdAsync(movieId);
            if (movie == null)
            {
                throw new ApiException(ErrorCode.NOT_FOUND);
            }
            movie.TotalLike--;

            _context.Favorite.Remove(favorite);
            await _context.SaveChangesAsync();
            
            return movie.TotalLike;
        }

        public async Task<List<MovieSearchDTO>> SearchMovieByNameAndGenreAsync(string value, long clientId)
        {
            Console.WriteLine(value);
            var searchValue = value?.Trim().ToLower() ?? "";
            var today = DateTime.Today;

            var query = _context.Movie
                .Where(m => m.ShowingTimes.Any(sw => sw.StartTime >= today));

            if (!string.IsNullOrEmpty(searchValue))
            {
                query = query.Where(m =>
                    m.Title.ToLower().Contains(searchValue) ||
                    m.GenreMovies.Any(gm => gm.Genre.Name.ToLower().Contains(searchValue)));
            }

            var result = await query
                .Select(m => new MovieSearchDTO
                {
                    MovieId = m.MovieId,
                    Title = m.Title,
                    Duration = m.Duration,
                    ReleaseDate = m.ReleaseDate,
                    PosterURL = m.PosterURL,
                    RequireAge = m.RequireAge,
                    TotalLike = m.TotalLike,
                    Rating = m.Reviews.Count() == 0 ? 0 : Math.Round(m.Reviews.Average(r => r.Rating), 1),
                    Genres = m.GenreMovies.Select(gm => gm.Genre.Name).ToList(),
                    IsFavorite = m.Favorites.Any(f => f.ClientId == clientId)
                })
                .ToListAsync();

            return result;
        }

        public async Task<List<FavoriteMovieDTO>> FavoriteMoviesAsync(long clientId)
        {
            var result = await _context.Movie.Where(m => m.Favorites.Any(f => f.ClientId == clientId)).Select(m => new FavoriteMovieDTO
            {
                MovieId = m.MovieId,
                Title = m.Title,
                Duration = m.Duration,
                ReleaseDate = m.ReleaseDate,
                PosterURL = m.PosterURL,
                RequireAge = m.RequireAge,
                TotalLike = m.TotalLike,
                Rating = m.Reviews.Count() == 0 ? 0 : Math.Round(m.Reviews.Average(r => r.Rating), 1),
                Genres = m.GenreMovies.Select(gm => gm.Genre.Name).ToList(),
                IsFavorite = true
            })
            .ToListAsync();

            return result;
        }

        public async Task<ICollection<MovieSearchDTO>> GetMoviesByCinemaIdAsync(long cinemaId, long clientId, DateTime date)
        {
            var movies = await _context.Movie.Where(m => m.ShowingTimes.Any(sw => sw.Room.CinemaId == cinemaId) &&
            m.ShowingTimes.Any(sw => sw.StartTime >= date)).Include(m => m.Reviews).Include(m => m.GenreMovies).ThenInclude(gm => gm.Genre)
            .Include(m => m.Favorites).Select(m => new MovieSearchDTO
            {
                Duration = m.Duration,
                Genres = m.GenreMovies.Select(gm => gm.Genre.Name).ToList(),
                IsFavorite = m.Favorites.Any(f => f.ClientId == clientId),
                MovieId = m.MovieId,
                PosterURL = m.PosterURL,
                Rating = m.Reviews.Count() == 0 ? 0 : Math.Round(m.Reviews.Average(m => m.Rating), 1),
                ReleaseDate = m.ReleaseDate,
                RequireAge = m.RequireAge,
                Title = m.Title,
                TotalLike = m.TotalLike
            }).ToListAsync();

            return movies;
        }

        public async Task<Movie> AddAsync(Movie movie)
        {
            _context.Movie.Add(movie);
            await _context.SaveChangesAsync();
            return movie;
        }
            
        public async Task DeleteAsync(Movie movie)
        {
            movie.IsAvailable = false;
            await _context.SaveChangesAsync();

        }

        public async Task<Movie?> GetByIdAsync(long id)
        {
            var movie = await _context.Movie.FindAsync(id);
            return movie;
        }

        public async Task UpdateAsync(Movie movie)
        {
            Console.WriteLine(movie.Title);
            _context.Movie.Update(movie);
            await _context.SaveChangesAsync();
        }
    }
}
