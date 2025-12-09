using FluentValidation;
using static CinemaBookingApp.Models.DTOs.ResetPasswordCode;

namespace CinemaBookingApp.Helpers.Validators.Auth
{
    public class ResetPasswordCodeRequestDTOValidator : AbstractValidator<ResetPasswordCodeRequestDTO>
    {
        public ResetPasswordCodeRequestDTOValidator()
        {
            RuleFor(r => r.Email).NotEmpty().WithMessage("Email is required")
                .EmailAddress().WithMessage("Wrong Email Format");

            RuleFor(r => r.Code).NotEmpty().WithMessage("Code is required");

            RuleFor(r => r.NewPassword).NotEmpty().WithMessage("Password is required")
                .MinimumLength(6).WithMessage("Password must be at least 6 characters");

            RuleFor(r => r.ConfirmNewPassword).NotEmpty().WithMessage("New password is required")
                .Equal(r => r.NewPassword).WithMessage("Passwords not match");
        }
    }
}
