using AutoMapper;
using CinemaBookingApp.Models.Entities;
using static CinemaBookingApp.Models.DTOs.Actor;

namespace CinemaBookingApp.Mappers
{
    public class ActorProfile : Profile
    {
        public ActorProfile()
        {
            CreateMap<CreateActorDTO, Actor>();

            CreateMap<Actor, ActorDTO>();

            CreateMap<Actor, ActorInMovieActorDTO>();
        }
    }
}
