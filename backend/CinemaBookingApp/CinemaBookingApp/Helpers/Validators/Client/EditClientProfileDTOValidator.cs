using FluentValidation;
using static CinemaBookingApp.Models.DTOs.Client;

namespace CinemaBookingApp.Helpers.Validators.Client
{
    public class EditClientProfileDTOValidator : AbstractValidator<EditClientProfileDTO>
    {
        public EditClientProfileDTOValidator() {


            RuleFor(x => x.Name).NotEmpty().WithMessage("Name is required");

            RuleFor(x => x.Email).NotEmpty().WithMessage("Email is required")
                                .EmailAddress().WithMessage("Wrong Email Form");

            RuleFor(x => x.City).NotEmpty().WithMessage("City is required");

            RuleFor(x => x.PhoneNumber)
               .NotEmpty().WithMessage("Phone is required")
               .Matches(@"^0\d{9}$").WithMessage("Phone number must start with 0 and have 10 numbers");

            RuleFor(r => r.DoB)
                .LessThan(DateTime.Now).WithMessage("Invalid Date");


            RuleFor(r => r.Genre)
                .NotEmpty().WithMessage("Genre is required");
        }
    }
}
