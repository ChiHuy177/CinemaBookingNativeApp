using AutoMapper;
using CinemaBookingApp.Repositories.Interfaces;
using CinemaBookingApp.Services.Interfaces;
using static CinemaBookingApp.Models.DTOs.Combo;

namespace CinemaBookingApp.Services.Implementations
{
    public class ComboService  : IComboService
    {
        private readonly IComboRepository _comboRepository;
        private readonly IMapper _mapper;

        public ComboService(IComboRepository comboRepository,IMapper mapper) { 
            _comboRepository = comboRepository;
            _mapper = mapper;
        }

        public async Task<ICollection<ComboDTO>> GetAllAsync()
        {
            var combos = await _comboRepository.GetAllAsync();

            var result = _mapper.Map<ICollection<ComboDTO>>(combos);

            return result;
        }
    }
}
