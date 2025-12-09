using AutoMapper;
using CinemaBookingApp.Models.Entities;
using static CinemaBookingApp.Models.DTOs.RoomType;

namespace CinemaBookingApp.Mappers
{
    public class RoomTypeProfile : Profile
    {
        public RoomTypeProfile()
        {
            CreateMap<RoomType,RoomTypeInRoomDTO>();
        }
    }
}
