using AutoMapper;
using CinemaBookingApp.Models.Entities;
using CinemaBookingApp.Repositories.Interfaces;
using CinemaBookingApp.Services.Interfaces;
using static CinemaBookingApp.Models.DTOs.MovieActor;

namespace CinemaBookingApp.Services.Implementations
{
    public class MovieActorService : IMovieActorService
    {
        private readonly IMovieActorRepository _repository;
        private readonly IMapper _mapper;

        public MovieActorService(IMovieActorRepository repository,IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task AddRangeAsync(IEnumerable<CreateMovieActorDTO> dtos,long movieID)
        {
            List<MovieActor> movieActors = _mapper.Map<List<MovieActor>>(dtos, opts =>
                    opts.Items["MovieId"] = movieID);


            await _repository.AddRangeAsync(movieActors);
        }
    }
}
