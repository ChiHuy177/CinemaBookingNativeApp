using AutoMapper;
using CinemaBookingApp.Models.Entities;
using static CinemaBookingApp.Models.DTOs.Combo;


namespace CinemaBookingApp.Mappers
{
    public class ComboProfile : Profile
    {
        
        public ComboProfile() {
            CreateMap<Combo, ComboDTO>();
        }
    }
}
