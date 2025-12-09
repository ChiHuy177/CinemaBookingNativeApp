using CinemaBookingApp.Helpers.Validators.MovieActor;
using FluentValidation;
using static CinemaBookingApp.Models.DTOs.Movie;


namespace CinemaBookingApp.Helpers.Validators.Movie
{
    public class CreateMovieDTOValidator : AbstractValidator<CreateMovieDTO>
    {
        public CreateMovieDTOValidator() { 
        
            RuleFor(x => x.Title).NotEmpty().WithMessage("Title is required");

            RuleFor(x => x.Description).NotEmpty().WithMessage("Description is required");

            RuleFor(x => x.Director).NotEmpty().WithMessage("Director is required");

            RuleFor(x => x.Company).NotEmpty().WithMessage("Company is required");

            RuleFor(x => x.Duration).NotEmpty().WithMessage("Duration is required")
                .GreaterThan(0).WithMessage("Duration must be a positive number");

            RuleFor(x => x.ReleaseDate).NotEmpty().WithMessage("ReleaseDate is required");

            // PosterURL is optional because file upload is used
            // RuleFor(x => x.PosterURL).NotEmpty().WithMessage("Poster is required");

            // TrailerURL is optional
            // RuleFor(x => x.TrailerURL).NotEmpty().WithMessage("Trailer is required");

            RuleFor(x => x.Language).NotEmpty().WithMessage("Language is required");

            // GenreIDs and CreateMovieActorDTOs are optional (can be empty lists)
            RuleForEach(x => x.GenreIDs)
                .Must(id => id > 0).WithMessage("Genre ID must be a positive number")
                .When(x => x.GenreIDs != null && x.GenreIDs.Any());

            RuleForEach(x => x.CreateMovieActorDTOs)
                .SetValidator(new CreateMovieActorDTOValidator())
                .When(x => x.CreateMovieActorDTOs != null && x.CreateMovieActorDTOs.Any());
        }
    }
}
