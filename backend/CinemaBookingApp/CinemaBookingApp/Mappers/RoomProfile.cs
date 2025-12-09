using AutoMapper;
using CinemaBookingApp.Models.Entities;
using static CinemaBookingApp.Models.DTOs.Room;

namespace CinemaBookingApp.Mappers
{
    public class RoomProfile : Profile
    {
        public RoomProfile() {
            CreateMap<Room, RoomInCinemaDTO>();
        }
    }
}
