namespace CinemaBookingApp.Services.Interfaces
{
    public interface IGenreMovieService
    {
        public Task AddRangeAsync(IEnumerable<long> genreIDs, long movieID);
    }
}
