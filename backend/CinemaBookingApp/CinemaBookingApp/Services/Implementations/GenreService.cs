using AutoMapper;
using CinemaBookingApp.Excecptions;
using CinemaBookingApp.Models.Entities;
using CinemaBookingApp.Repositories.Interfaces;
using CinemaBookingApp.Services.Interfaces;
using static CinemaBookingApp.Models.DTOs.Genre;

namespace CinemaBookingApp.Services.Implementations
{
    public class GenreService : IGenreService
    {
        private readonly IGenreRepository _repository;
        private readonly IMapper _mapper;

        public GenreService(IGenreRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }
        public async Task<List<GenreDTO>> GetAllAsync()
        {
            var genres = await _repository.GetAllAsync();
            return _mapper.Map<List<GenreDTO>>(genres);
        }

        public async Task<GenreDTO> GetByIdAsync(long id)
        {
            var genre = await _repository.GetByIdAsync(id);

            if (genre == null)
            {
                throw new ApiException(ErrorCode.NOT_FOUND);
            }
                
            return _mapper.Map<GenreDTO>(genre);
        }

        public async Task<GenreDTO> CreateAsync(CreateGenreDTO dto)
        {
            var genre = _mapper.Map<Genre>(dto);
            var createdGenre = await _repository.AddAsync(genre);
            return _mapper.Map<GenreDTO>(createdGenre);
        }

        public async Task<string> UpdateAsync(long id, UpdateGenreDTO dto)
        {
            var genre = await _repository.GetByIdAsync(id);
            if(genre == null)
            {
                throw new ApiException(ErrorCode.NOT_FOUND);
            }
            _mapper.Map(dto, genre);
            await _repository.UpdateAsync(genre);
            return "Update Successfully!!!";
        }

        public async Task<string> DeleteAsync(long id)
        {
            var genre = await _repository.GetByIdAsync(id);
            if(genre == null)
            {
                throw new ApiException(ErrorCode.NOT_FOUND);
            }
               
            await _repository.DeleteAsync(genre);

            return "Delete Successfully!!";
        }
    }
}
