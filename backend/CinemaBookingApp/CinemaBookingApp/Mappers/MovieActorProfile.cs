using AutoMapper;
using CinemaBookingApp.Models.Entities;
using static CinemaBookingApp.Models.DTOs.MovieActor;

namespace CinemaBookingApp.Mappers
{
    public class MovieActorProfile : Profile
    {
        public MovieActorProfile() {

            CreateMap<CreateMovieActorDTO, MovieActor>()
                .ForMember(dest => dest.MovieId, opt =>
                    opt.MapFrom((src, dest, destMember, context) =>
                        (long)context.Items["MovieId"]));

            CreateMap<MovieActor, MovieActorInDetailMovieDTO>();
        }
    }
}
