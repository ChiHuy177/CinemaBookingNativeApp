using CinemaBookingApp.Data;
using CinemaBookingApp.Models.Entities;
using CinemaBookingApp.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using static CinemaBookingApp.Models.DTOs.Combo;

namespace CinemaBookingApp.Repositories.Implementations
{
    public class ComboRepository : IComboRepository
    {
        private readonly AppDbContext _context;

        public ComboRepository(AppDbContext context) { 
            _context = context;
        }

        public async Task<ICollection<Combo>> GetAllAsync()
        {
            var combos = await _context.Combo.Where(c => c.Status && c.Quantity > 0).ToListAsync();

            return combos;
        }
        public async Task<ICollection<UnAvailableComboDTO>> GetUnavailableCombosForBookingAsync(ICollection<ComboInTicketDTO> comboInTickets)
        {
            var comboIds = comboInTickets.Select(c => c.ComboId).ToList();

            
            var combosFromDb = await _context.Combo
                .Where(c => comboIds.Contains(c.ComboId))
                .Select(c => new { c.ComboId, c.Name, c.Quantity })
                .ToListAsync();

           
            var unavailableCombos = comboInTickets
                .Join(combosFromDb,
                      input => input.ComboId,
                      dbCombo => dbCombo.ComboId,
                      (input, dbCombo) => new { input, dbCombo })
                .Where(x => x.input.Quantity > x.dbCombo.Quantity)
                .Select(x => new UnAvailableComboDTO
                {
                    ComboId = x.dbCombo.ComboId,
                    Name = x.dbCombo.Name
                })
                .ToList();

            return unavailableCombos;
        }

        public async Task ReduceQuantityCombosAsync(ICollection<ComboInTicketDTO> combos)
        {
            foreach (var combo in combos)
            {
                var dbCombo = await _context.Combo.FirstOrDefaultAsync(c => c.ComboId == combo.ComboId);
                if (dbCombo != null)
                {
                    dbCombo.Quantity -= combo.Quantity;

                    if(dbCombo.Quantity <= 0)
                    {
                        dbCombo.Status = false;
                    }
                }
            }

            await _context.SaveChangesAsync();
        }

    }
}
