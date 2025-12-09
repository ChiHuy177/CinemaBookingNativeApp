using CinemaBookingApp.Helpers.Validators.Combo;
using FluentValidation;
using static CinemaBookingApp.Models.DTOs.Ticket;

namespace CinemaBookingApp.Helpers.Validators.Ticket
{
    public class CreateTicketDTOValidator : AbstractValidator<CreateTicketDTO>
    {
        public CreateTicketDTOValidator()
        {

            RuleFor(x => x.MovieId).NotEmpty().WithMessage("Movie Id is required");

            RuleFor(x => x.CinemaName).NotEmpty().WithMessage("Cinema name is required");

            RuleFor(x => x.ClientEmail).NotEmpty().WithMessage("Client email is required");

            RuleFor(x => x.SeatIds).ForEach(s => s.LessThan(0).WithMessage("Seat Id must be positive"));


            RuleForEach(x => x.Combos).SetValidator(new ComboInTicketDTOValidator());


            RuleFor(x => x.TotalPriceSeats).LessThan(0).WithMessage("TotalPriceSeats must be positive");


            RuleFor(x => x.TotalPrice).LessThan(0).WithMessage("TotalPrice must be positive");

            RuleFor(x => x.TotalPriceCombos).LessThan(0).WithMessage("TotalPriceCombos must be positive");

            RuleFor(x => x.TotalPriceDiscount).LessThan(0).WithMessage("TotalPriceDiscount must be positive");

            RuleFor(x => x.LoyalPointsUsed).LessThan(0).WithMessage("LoyalPointsUsed must be positive");

            RuleFor(x => x.CouponId).LessThan(0).WithMessage("Coupon Id must be positive");
        }
    
    }
}
