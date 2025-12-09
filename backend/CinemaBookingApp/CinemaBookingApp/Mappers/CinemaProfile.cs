using AutoMapper;
using CinemaBookingApp.Models.Entities;
using static CinemaBookingApp.Models.DTOs.Cinema;

namespace CinemaBookingApp.Mappers
{
    public class CinemaProfile : Profile
    {
        public CinemaProfile() {

            CreateMap<Cinema, CinemaDTO>().ReverseMap();

            CreateMap<Cinema, CinemaForBookingDTO>();
        }
    }
}
