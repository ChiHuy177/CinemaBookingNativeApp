using AutoMapper;
using CinemaBookingApp.Excecptions;
using CinemaBookingApp.Models.Entities;
using CinemaBookingApp.Repositories.Interfaces;
using CinemaBookingApp.Services.Interfaces;
using static CinemaBookingApp.Models.DTOs.Review;

namespace CinemaBookingApp.Services.Implementations
{
    public class ReviewService : IReviewService
    {
        private readonly IReviewRepository _reviewRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IMapper _mapper;

        public ReviewService(IReviewRepository reviewRepository, IHttpContextAccessor httpContextAccessors,IMapper mapper)
        {
            _reviewRepository = reviewRepository;
            _httpContextAccessor = httpContextAccessors;
            _mapper = mapper;
        }


        public async Task<string> AddAsync(ReviewCreateDTO dto)
        {
            var clientId = GetClientIdFromClaims();


            Review review = _mapper.Map<Review>(dto);
            review.ClientId = clientId;
            review.CreatedAt = DateTime.Now;
            await _reviewRepository.AddAsync(review);

            return "Add Successfully!!";

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
    }
}
