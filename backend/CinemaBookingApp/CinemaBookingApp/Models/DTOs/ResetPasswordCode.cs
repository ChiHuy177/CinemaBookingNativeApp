namespace CinemaBookingApp.Models.DTOs
{
    public class ResetPasswordCode
    {

        public class ResetPasswordCodeRequestDTO
        {
            public string Email { get; set; }

            public string Code { get; set; }

            public string NewPassword { get; set; }

            public string ConfirmNewPassword { get; set; }
        }
    }
}
