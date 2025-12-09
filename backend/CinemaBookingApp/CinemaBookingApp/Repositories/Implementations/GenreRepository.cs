using CinemaBookingApp.Data;
using CinemaBookingApp.Models.Entities;
using CinemaBookingApp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaBookingApp.Repositories.Implementations
{
    public class GenreRepository : IGenreRepository
    {

        private readonly AppDbContext _context;

        public GenreRepository(AppDbContext context)
        {
            _context = context;
        }
        public async Task<Genre> AddAsync(Genre genre)
        {
            _context.Genre.Add(genre);
            await _context.SaveChangesAsync();

            return genre;

        }

        public async Task DeleteAsync(Genre genre)
        {
            _context.Genre.Remove(genre);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Genre>> GetAllAsync()  
        {
            return await _context.Genre.ToListAsync();
        }

        public async Task<Genre?> GetByIdAsync(long id)
        {
            var genre = await _context.Genre.FindAsync(id);

            return genre;
        }

        public async Task UpdateAsync(Genre genre)
        {
            _context.Genre.Update(genre);
            await _context.SaveChangesAsync();
        }
    }
}
