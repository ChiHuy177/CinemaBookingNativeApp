using AutoMapper;
using CinemaBookingApp.Models.Entities;
using CinemaBookingApp.Repositories.Interfaces;
using CinemaBookingApp.Services.Interfaces;
using static CinemaBookingApp.Models.DTOs.Actor;

namespace CinemaBookingApp.Services.Implementations
{
    public class ActorService : IActorService
    {
        private readonly IMapper _mapper;
        private readonly IActorRepository _actorRepository;

        public ActorService(IMapper mapper, IActorRepository actorRepository)
        {
            _mapper = mapper;
            _actorRepository = actorRepository;
        }

        public async Task<List<ActorDTO>> GetAllAsync()
        {
            var actors = await _actorRepository.GetAllAsync();
            return _mapper.Map<List<ActorDTO>>(actors);
        }

        public async Task<string> AddAsync(CreateActorDTO dto)
        {
            Actor actor = _mapper.Map<Actor>(dto);
            await _actorRepository.AddAsync(actor);
            return "Add Successfully!";
        }
    }
}
