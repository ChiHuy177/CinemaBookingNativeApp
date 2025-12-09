using CinemaBookingApp.Data;
using CinemaBookingApp.Models.Entities;
using CinemaBookingApp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using static CinemaBookingApp.Models.DTOs.Seat;
using static CinemaBookingApp.Models.DTOs.SeatType;

namespace CinemaBookingApp.Repositories.Implementations
{
    public class SeatRepository : ISeatRepository
    {
        private readonly AppDbContext _context;

        public SeatRepository(AppDbContext context) { 
            _context = context;
        }

        public async Task<ICollection<SeatRowForBookingDTO>> GetSeatsForBookingAsync(long showingTimeId)
        {
            var seats = await _context.Seat.Where(s => s.Room.ShowingTimes.Any(sw => sw.ShowingTimeId == showingTimeId))
                .OrderBy(s => s.Row).ThenBy(s => s.Column)
                .GroupBy(s => s.Row)
                .Select(g => new SeatRowForBookingDTO
                {
                    Row = g.Key,
                    SeatColumns = g.Select(s => new SeatColumnForBookingDTO
                    {
                        Column = s.Column,
                        Status = s.IsAvailable ? "available" : "taken",
                        SeatId = s.SeatId,
                        Row = g.Key,
                        SeatType = new SeatTypeDTO {
                            Name = s.SeatType.Name,
                            Price = s.SeatType.Price,
                            SeatTypeId = s.SeatType.SeatTypeId
                        }
                    }).ToList()
                })
                .ToListAsync();

            return seats;
        }

        public async Task<ICollection<UnAvailableSeatDTO>> GetUnAvailableSeatsForBookingAsync(ICollection<long> seatIds)
        {
            var unavailableSeats = await _context.Seat.Where(s => seatIds.Contains(s.SeatId) && !s.IsAvailable).Select(us => new UnAvailableSeatDTO
            {
                SeatId = us.SeatId,
                Column = us.Column,
                Row = us.Row
            }).ToListAsync();

            return unavailableSeats;
        }

        public async Task MakeSeatsUnAvailableAsync(ICollection<long> seatIds)
        {

            await _context.Seat
                .Where(s => seatIds.Contains(s.SeatId))
                .ExecuteUpdateAsync(s => s.SetProperty(p => p.IsAvailable, false));
        }

        public async Task<ICollection<string>> GetSeatsNameAsync(ICollection<long> seatIds)
        {
            var seatsName = await _context.Seat.Where(s => seatIds.Contains(s.SeatId)).Select(s => s.Row + s.Column).ToListAsync();

            return seatsName;
         
        }

    }
}
