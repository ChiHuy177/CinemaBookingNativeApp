using AutoMapper;
using CinemaBookingApp.Models.Entities;
using static CinemaBookingApp.Models.DTOs.Review;

namespace CinemaBookingApp.Mappers
{
    public class ReviewProfile : Profile
    {
        public ReviewProfile() {

            CreateMap<ReviewCreateDTO, Review>();

            CreateMap<Review, ReviewInMovieDetailDTO>();
        }
    }
}
