using static CinemaBookingApp.Models.DTOs.Ticket;

namespace CinemaBookingApp.Helpers.Email
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string toEmail, string subject, string htmlMessage);

        Task SendTicketEmailAsync(string email, string subject, TicketForEmailDTO ticket);

    }
}
