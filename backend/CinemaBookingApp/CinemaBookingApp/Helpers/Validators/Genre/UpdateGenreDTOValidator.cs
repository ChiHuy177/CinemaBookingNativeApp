using FluentValidation;
using static CinemaBookingApp.Models.DTOs.Genre;

namespace CinemaBookingApp.Helpers.Validators.Genre
{
    public class UpdateGenreDTOValidator : AbstractValidator<UpdateGenreDTO>
    {
        public UpdateGenreDTOValidator()
        {
            RuleFor(g => g.Name).NotEmpty().WithMessage("Name is required");
        }
    }
}
