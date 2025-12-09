using FluentValidation;
using static CinemaBookingApp.Models.DTOs.Client;

namespace CinemaBookingApp.Helpers.Validators.Client
{
    public class ChangePasswordClientDTOValidator : AbstractValidator<ChangePasswordClientDTO>
    {
        public ChangePasswordClientDTOValidator() {

            RuleFor(x => x.Email).NotEmpty().WithMessage("Email is required")
                                .EmailAddress().WithMessage("Wrong Email Format");

            RuleFor(x => x.CurrentPassword).NotEmpty().WithMessage("Current password is required");

            RuleFor(x => x.NewPassword).NotEmpty().WithMessage("Current password is required");

            RuleFor(x => x.ConfirmNewPassword).NotEmpty().WithMessage("Current password is required")
                                            .Equal(x => x.CurrentPassword).WithMessage("Password not match");
        }
    }
}
