using CinemaBookingApp.Data;
using CinemaBookingApp.Excecptions;
using CinemaBookingApp.Models.Entities;
using CinemaBookingApp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaBookingApp.Repositories.Implementations
{
    public class CinemaRepository : ICinemaRepository
    {
        private readonly AppDbContext _context;

        public CinemaRepository(AppDbContext context)
        {
            _context = context;
        }


        public async Task<List<Cinema>> GetAllAsync()
        {
            return await _context.Cinema.ToListAsync();
        }

        public async Task<Cinema> GetByIdAsync(long id)
        {
            var cinema = await _context.Cinema.FirstOrDefaultAsync(c => c.CinemaId == id);
            if (cinema == null)
            {

                throw new ApiException(ErrorCode.NOT_FOUND);
            }

            return cinema;
        }


        public async Task<List<Cinema>> GetCinemasForBookingAsync(long movieId)
        {
            var today = DateTime.Today;
            var cinemas = await _context.Cinema.Where(c => c.Rooms.Any( r => r.ShowingTimes.Any(sw => sw.MovieId == movieId 
            && sw.StartTime >= today)))
                .Select(c => new Cinema
                {
                    Name = c.Name,
                    CinemaId = c.CinemaId,
                    Rooms = c.Rooms.Where(r => r.ShowingTimes.Any(sw => sw.MovieId == movieId
                        && sw.StartTime >= today)).Select(r => new Room
                        {
                            RoomId = r.RoomId,
                            RoomType = r.RoomType,
                            Name = r.Name,
                            ShowingTimes = r.ShowingTimes.Where(sw => sw.MovieId == movieId && sw.StartTime.Date >= today)
                                    .ToList()
                        }).ToList()
                })
                .ToListAsync();

            return cinemas;
        }
    }
}
