using AutoMapper;
using CinemaBookingApp.Excecptions;
using CinemaBookingApp.Models.DTOs;
using CinemaBookingApp.Repositories.Interfaces;
using CinemaBookingApp.Services.Interfaces;
using static CinemaBookingApp.Models.DTOs.Cinema;

namespace CinemaBookingApp.Services.Implementations
{
    public class CinemaService : ICinemaService
    {
        private readonly ICinemaRepository _repository;
        private readonly IMapper _mapper;
        public CinemaService(ICinemaRepository repository,IMapper mapper) { 
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<List<CinemaDTO>> GetAllAsync()
        {
            var cinemas = await _repository.GetAllAsync();

            return _mapper.Map<List<CinemaDTO>>(cinemas);
        }

        public async Task<List<CinemaWithCityCountDTO>> GetAllForBookingByCinemasAsync()
        {
            var cinemas = await _repository.GetAllAsync();
            var result = cinemas.GroupBy(c => c.City).Select(g => new CinemaWithCityCountDTO
            {
                City = g.Key,
                Count = g.Count(),
                Cinemas = _mapper.Map<List<CinemaDTO>>(g.ToList())
            }).ToList();

            return result;
        }


        public async Task<CinemaDTO> GetByIdAsync(long id)
        {
            var result = await _repository.GetByIdAsync(id);

            if (result == null) {
                throw new ApiException(ErrorCode.NOT_FOUND);
            }

            return _mapper.Map<CinemaDTO>(result);
        }

        public async Task<List<CinemaForBookingDTO>> GetCinemasForBookingAsync(long movieId)
        {
            var cinemas = await _repository.GetCinemasForBookingAsync(movieId);

            var result = _mapper.Map<List<CinemaForBookingDTO>>(cinemas);

            return result;
        }
    }
}
