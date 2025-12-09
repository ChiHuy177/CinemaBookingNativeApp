using AutoMapper;
using CinemaBookingApp.Excecptions;
using CinemaBookingApp.Models.Entities;
using CinemaBookingApp.Repositories.Interfaces;
using CinemaBookingApp.Services.Interfaces;
using System.Security.Claims;
using static CinemaBookingApp.Models.DTOs.Coupon;

namespace CinemaBookingApp.Services.Implementations
{
    public class CouponService : ICouponService
    {
        private readonly ICouponRepository _couponRepository;
        private readonly ICouponUserRepository _couponUserRepository;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CouponService(ICouponRepository couponRepository,IMapper mapper,IHttpContextAccessor httpContextAccessor,ICouponUserRepository couponUserRepository) { 
            _couponRepository = couponRepository;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
            _couponUserRepository = couponUserRepository;
        }

        public async Task<string> AddAsync(CouponCreateDTO dto)
        {
            var coupon = _mapper.Map<Coupon>(dto);

            await _couponRepository.AddAsync(coupon);

            return "Add Successfully!";
        }

        public async Task<List<CouponDTO>> GetAllAsync(string clientEmail)
        {
            var tempClientEmail = GetClientEmailFromClaims();
            if(tempClientEmail != clientEmail)
            {
                throw new ApiException(ErrorCode.UNAUTHORIZED);
            }

            var clientId = GetClientIdFromClaims();

            var couponUsers = await _couponUserRepository.GetAllAsync(clientId);

            var result = couponUsers.Select(cu => _mapper.Map<CouponDTO>(cu.Coupon)).ToList();

            return result;

        }


        private long GetClientIdFromClaims()
        {
            var user = _httpContextAccessor.HttpContext?.User;

            var temp = user?.FindFirst("clientId")?.Value;

            if (temp == null)
            {
                throw new ApiException(ErrorCode.UNAUTHORIZED);
            }

            var clientId = long.Parse(temp);
            return clientId;
        }

        private string GetClientEmailFromClaims()
        {
            var user = _httpContextAccessor.HttpContext?.User;
            foreach (var claim in user?.Claims)
            {
                Console.WriteLine($"Claim Type: {claim.Type}, Value: {claim.Value}");
            }

            var email = user?.FindFirst(ClaimTypes.NameIdentifier)?.Value;



            if (email == null)
            {
                throw new ApiException(ErrorCode.UNAUTHORIZED);
            }


            return email;
        }
    }
}
