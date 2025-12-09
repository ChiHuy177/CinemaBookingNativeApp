namespace CinemaBookingApp.Models.DTOs
{
    public class Login
    {
        public class LoginResponseDTO
        {
            public string Token { get; set; }

            public bool Authenticated { get; set; }
            
            public string Email { get; set; }

        }

        public class LoginRequestDTO
        {
            public string Email { get; set; }

            public string Password { get; set; }
        }
    }
}
