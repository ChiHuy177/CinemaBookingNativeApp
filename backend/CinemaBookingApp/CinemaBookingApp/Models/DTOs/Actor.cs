namespace CinemaBookingApp.Models.DTOs
{
    public class Actor
    {

        public class ActorDTO
        {
            public long ActorId { get; set; }

            public string Name { get; set; }

            public string ImageURL { get; set; }
        }


        public class ActorInMovieActorDTO
        {
            public string Name { get; set; }

            public string ImageURL { get; set; }
        }

        public class CreateActorDTO
        {
            public string Name { get; set; }

            public string ImageURL { get; set; }
        }
    }
}
