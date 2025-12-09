using FluentValidation;
using static CinemaBookingApp.Models.DTOs.Register;
namespace CinemaBookingApp.Helpers.Validators.Auth
{
    public class RegisterRequestDTOValidator : AbstractValidator<RegisterRequestDTO>
    {
        public RegisterRequestDTOValidator()
        {
            RuleFor(r => r.Name)
                .NotEmpty().WithMessage("Name is required");

            RuleFor(r => r.Email)
                .NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Wrong Email format");

            RuleFor(r => r.PhoneNumber)
                .NotEmpty().WithMessage("Phone is required")
                .Matches(@"^0\d{9}$").WithMessage("Phone number must start with 0 and have 10 numbers");

            RuleFor(r => r.DoB)
                .LessThan(DateTime.Now).WithMessage("Invalid Date");

            RuleFor(r => r.City)
                .NotEmpty().WithMessage("City is required");


            RuleFor(r => r.Genre)
                .NotEmpty().WithMessage("Genre is required");


            RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters");

            RuleFor(x => x.ConfirmPassword)
                .Equal(x => x.Password).WithMessage("Passwords do not match");


        }
    }
}
