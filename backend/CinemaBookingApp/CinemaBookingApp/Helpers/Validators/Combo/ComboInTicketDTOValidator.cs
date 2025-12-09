using FluentValidation;
using static CinemaBookingApp.Models.DTOs.Combo;

namespace CinemaBookingApp.Helpers.Validators.Combo
{
    public class ComboInTicketDTOValidator : AbstractValidator<ComboInTicketDTO>
    {
        public ComboInTicketDTOValidator() {
            RuleFor(x => x.Quantity).LessThan(0).WithMessage("Quantity must be not negative");

            RuleFor(x => x.ComboId).LessThan(0).WithMessage("Combo Id must be positive");
        }  
    }
}
