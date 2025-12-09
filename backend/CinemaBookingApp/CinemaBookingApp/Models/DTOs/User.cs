namespace CinemaBookingApp.Models.DTOs
{
    public class User
    {

        public class UserResponseDTO
        {
            public string Email { get; set; }
            public string PhoneNumber { get; set; }

            public string Name { get; set; }

            public DateTime DoB { get; set; }

            public string City { get; set; }

            public double LoyalPoints { get; set; }
        }
    }
}
