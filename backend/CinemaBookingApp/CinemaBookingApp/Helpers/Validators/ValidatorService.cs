using FluentValidation;

namespace CinemaBookingApp.Helpers.Validators
{
    public class ValidatorService : IValidatorService
    {
        private readonly IServiceProvider _serviceProvider;

        public ValidatorService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public async Task ValidateAsync<T>(T model)
        {
            var validator = _serviceProvider.GetService<IValidator<T>>();
            if (validator == null) return;

            var result = await validator.ValidateAsync(model);
            if (!result.IsValid)
                throw new ValidationException(result.Errors);
        }
    }

}
