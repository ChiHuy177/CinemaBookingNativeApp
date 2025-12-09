namespace CinemaBookingApp.Models.DTOs
{
    public class Register
    {
        public class RegisterRequestDTO
        {
            public string Name { get; set; }

            public string PhoneNumber { get; set; }

            public string Email { get; set; }

            public DateTime DoB { get; set; }

            public string City { get; set; }
            
            public string Address { get; set; }

            public bool Genre { get; set; }

            public string Password { get; set; }

            public string ConfirmPassword { get; set; }


        }
    }
}
