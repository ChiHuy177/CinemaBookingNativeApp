using AutoMapper;
using CinemaBookingApp.Models.Entities;
using static CinemaBookingApp.Models.DTOs.Client;
using static CinemaBookingApp.Models.DTOs.Movie;
using static CinemaBookingApp.Models.DTOs.Register;

namespace CinemaBookingApp.Mappers
{
    public class ClientProfile : Profile
    {
        public ClientProfile()
        {
            CreateMap<RegisterRequestDTO, Client>();

            CreateMap<Client, ClientProfileDTO>();

            CreateMap<EditClientProfileDTO, Client>()
                .ForMember(dest => dest.Avatar,opt => opt.Ignore());

            CreateMap<Client, ClientInReviewDTO>();
        }

    }
}
