using AutoMapper;
using CinemaBookingApp.Models.Entities;
using static CinemaBookingApp.Models.DTOs.Coupon;

namespace CinemaBookingApp.Mappers
{
    public class CouponProfile : Profile
    {
        public CouponProfile() {
            CreateMap<CouponCreateDTO, Coupon>();

            CreateMap<Coupon,CouponDTO>();
        }

        
    }
}
