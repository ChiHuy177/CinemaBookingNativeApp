namespace CinemaBookingApp.Helpers.Validators
{
    public interface IValidatorService
    {
        Task ValidateAsync<T>(T model);
    }
}
