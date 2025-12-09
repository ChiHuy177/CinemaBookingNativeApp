using AutoMapper;
using CinemaBookingApp.Models.Entities;
using static CinemaBookingApp.Models.DTOs.Actor;
using static CinemaBookingApp.Models.DTOs.Client;
using static CinemaBookingApp.Models.DTOs.Movie;
using static CinemaBookingApp.Models.DTOs.MovieActor;
using static CinemaBookingApp.Models.DTOs.Review;

namespace CinemaBookingApp.Mappers
{
    public class MovieProfile : Profile
    {
        public MovieProfile() {

            CreateMap<CreateMovieDTO, Movie>();

            CreateMap<Movie, MovieDTO>().ReverseMap();

            CreateMap<UpdateMovieDTO, Movie>();

            CreateMap<Movie, MovieDetailHomeDTO>()
                .ForMember(dest => dest.IsFavorite,
                    opt => opt.MapFrom(src => src.Favorites.Any()))
                .ForMember(dest => dest.Genres,
                    opt => opt.MapFrom(src => src.GenreMovies.Select(gm => gm.Genre).ToList()))
                .ForMember(dest => dest.Rating,
                    opt => opt.MapFrom(src => src.Reviews.Count() == 0 ? 0 : Math.Round(src.Reviews.Average(r => r.Rating),1)));

           
            

           

            CreateMap<Movie, MovieSearchDTO>()
                .ForMember(dest => dest.Genres,
                    opt => opt.MapFrom(src => src.GenreMovies.Select(gm => gm.Genre.Name).ToList()))
                .ForMember(dest => dest.Rating,
                    opt => opt.MapFrom(src => src.Reviews.Count() == 0 ? 0 : Math.Round(src.Reviews.Average(r => r.Rating),1)));


            CreateMap<Movie, MovieMainHomeDTO>();
        }
    }
}
