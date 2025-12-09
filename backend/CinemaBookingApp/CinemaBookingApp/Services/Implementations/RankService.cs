using AutoMapper;
using CinemaBookingApp.Excecptions;
using CinemaBookingApp.Repositories.Interfaces;
using CinemaBookingApp.Services.Interfaces;
using static CinemaBookingApp.Models.DTOs.Rank;

namespace CinemaBookingApp.Services.Implementations
{
    public class RankService : IRankService
    {
        private readonly IRankRepository _rankRepository;
        private readonly IMapper _mapper;

        public RankService(IRankRepository rankRepository,IMapper mapper)
        {
            _rankRepository = rankRepository;
            _mapper = mapper;
        }

        public async Task<ClientRankDTO> GetRankByEmailClientAsync(string clientEmail)
        {
            var rank = await _rankRepository.GetRankByEmailClientAsync(clientEmail);

            if (rank == null)
            {
                throw new ApiException(ErrorCode.NOT_FOUND);
            }
            
            return _mapper.Map<ClientRankDTO>(rank);
        }
    }
}
