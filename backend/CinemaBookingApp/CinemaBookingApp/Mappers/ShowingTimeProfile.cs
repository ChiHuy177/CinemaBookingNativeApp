using AutoMapper;
using CinemaBookingApp.Models.Entities;
using static CinemaBookingApp.Models.DTOs.ShowingTime;

namespace CinemaBookingApp.Mappers
{
    public class ShowingTimeProfile : Profile
    {
        public ShowingTimeProfile() {
            CreateMap<ShowingTime,ShowingTimeInRoomDTO>();
        }
    }
}
