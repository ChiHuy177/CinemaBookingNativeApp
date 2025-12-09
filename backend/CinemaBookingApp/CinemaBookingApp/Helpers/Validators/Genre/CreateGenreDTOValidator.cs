using FluentValidation;
using static CinemaBookingApp.Models.DTOs.Genre;

namespace CinemaBookingApp.Helpers.Validators.Genre
{
    public class CreateGenreDTOValidator : AbstractValidator<CreateGenreDTO>
    {

        public CreateGenreDTOValidator()
        {

            RuleFor(g => g.Name).NotEmpty().WithMessage("Name is required");
        }
    }
}
