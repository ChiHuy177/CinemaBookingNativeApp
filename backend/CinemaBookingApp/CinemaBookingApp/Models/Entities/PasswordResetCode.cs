using System.ComponentModel.DataAnnotations;

namespace CinemaBookingApp.Models.Entities
{
    public class PasswordResetCode
    {
        [Key]
        public Guid PasswordResetCodeId { get; set; } = Guid.NewGuid();
        public string Email { get; set; }

        public string Code { get; set; }

        public DateTime ExpiredAt { get; set; }

    }
}
