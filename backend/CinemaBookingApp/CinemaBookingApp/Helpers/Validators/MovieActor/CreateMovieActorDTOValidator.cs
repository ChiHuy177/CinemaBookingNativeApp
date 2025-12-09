using FluentValidation;
using static CinemaBookingApp.Models.DTOs.MovieActor;

namespace CinemaBookingApp.Helpers.Validators.MovieActor
{
    public class CreateMovieActorDTOValidator : AbstractValidator<CreateMovieActorDTO>
    {
        public CreateMovieActorDTOValidator() {

            RuleFor(x => x.ActorId).NotEmpty().WithMessage("Actor Id is required")
                                    .LessThan(0).WithMessage("Actor Id must be a positive number");

            RuleFor(x => x.CharacterName).NotEmpty().WithMessage("Charactername is required");
               
        }
    }
}
