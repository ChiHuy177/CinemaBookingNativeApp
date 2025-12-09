using static CinemaBookingApp.Models.DTOs.Actor;

namespace CinemaBookingApp.Models.DTOs
{
    public class MovieActor
    {

        public class MovieActorDTO
        {
            public long MovieId { get; set; }

            public long ActorId { get; set; }

            public string CharacterName { get; set; }
        }

        public class CreateMovieActorDTO
        {
            public long ActorId { get; set; }

            public string CharacterName { get; set; }

        }

        public class MovieActorInDetailMovieDTO
        {
            public string CharacterName { get; set; }

            public ActorInMovieActorDTO Actor { get; set; }
        }
    }
}
