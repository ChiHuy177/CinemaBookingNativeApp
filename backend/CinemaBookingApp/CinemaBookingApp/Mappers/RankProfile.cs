using AutoMapper;
using CinemaBookingApp.Models.Entities;
using static CinemaBookingApp.Models.DTOs.Rank;

namespace CinemaBookingApp.Mappers
{
    public class RankProfile : Profile
    {
        public RankProfile() {
            CreateMap<Rank, RankDTO>();
            CreateMap<Rank, ClientRankDTO>();
        }
    }
}
