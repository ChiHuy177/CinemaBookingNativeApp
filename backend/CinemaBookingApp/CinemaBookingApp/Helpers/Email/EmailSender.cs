using System.Net.Mail;
using System.Net;
using static CinemaBookingApp.Models.DTOs.Ticket;
using CinemaBookingApp.Helpers.QR_Code;
using System.Text;
using System.Net.Mime;
using MimeKit;


using MailKit.Net.Smtp;
using MailKit.Security;


namespace CinemaBookingApp.Helpers.Email
{
    public class EmailSender : IEmailSender
    {
        private readonly IConfiguration _configuration;

        public EmailSender(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string htmlMessage)
        {
            var smtpClient = new System.Net.Mail.SmtpClient(_configuration["EmailSettings:SmtpHost"])
            {
                Port = 587,
                Credentials = new NetworkCredential(
                    _configuration["EmailSettings:Email"],
                    _configuration["EmailSettings:Password"]),
                EnableSsl = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_configuration["EmailSettings:Email"]),
                Subject = subject,
                Body = htmlMessage,
                IsBodyHtml = true
            };
            mailMessage.To.Add(toEmail);

            await smtpClient.SendMailAsync(mailMessage);
        }

        public async Task SendTicketEmailAsync(string email, string subject, TicketForEmailDTO ticket)
        {
            var baseURL = $"https://localhost:7092/api/ticket/verify/{ticket.TicketCode}";

            var qrCodeBytes = QrCodeGenerator.GenerateQrCodeAsByteArray(ticket.TicketCode, baseURL);

            var htmlMessage = GenerateTicketEmailHtml(ticket);

            await SendEmailWithAttachmentAsync(email, subject, htmlMessage, qrCodeBytes, ticket.TicketCode);
        }


        private async Task SendEmailWithAttachmentAsync(string email, string subject, string htmlContent, byte[] qrCodeBytes, string ticketCode)
        {
            var message = new MimeMessage();


            message.From.Add(new MailboxAddress("Cinema Booking App", _configuration["EmailSettings:FromAddress"]));
            message.To.Add(new MailboxAddress("", email));
            message.Subject = subject;


            var builder = new BodyBuilder();
            builder.HtmlBody = htmlContent;


            var attachment = builder.Attachments.Add($"qr-{ticketCode}.png", qrCodeBytes, MimeKit.ContentType.Parse("image/png"));
            attachment.ContentId = $"qr-{ticketCode}";
            attachment.ContentDisposition = new MimeKit.ContentDisposition(MimeKit.ContentDisposition.Inline);

            message.Body = builder.ToMessageBody();

            using var client = new MailKit.Net.Smtp.SmtpClient();
            await client.ConnectAsync(_configuration["EmailSettings:SmtpHost"],
                                     int.Parse(_configuration["EmailSettings:SmtpPort"]),
                                     SecureSocketOptions.StartTls);

            await client.AuthenticateAsync(_configuration["EmailSettings:Username"],
                                          _configuration["EmailSettings:Password"]);

            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }

        private string GenerateTicketEmailHtml(TicketForEmailDTO ticket)
        {
            var sb = new StringBuilder();

            sb.Append(@"
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Vé Xem Phim</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
                .ticket-container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
                .ticket-header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
                .ticket-body { padding: 30px; }
                .ticket-info { margin-bottom: 20px; }
                .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; padding: 8px 0; border-bottom: 1px solid #eee; }
                .info-label { font-weight: bold; color: #555; }
                .info-value { color: #333; }
                .qr-section { text-align: center; margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; }
                .qr-code { margin: 20px 0; }
                .footer { text-align: center; padding: 20px; background: #f8f9fa; color: #666; font-size: 14px; }
                .ticket-code { font-size: 24px; font-weight: bold; color: #667eea; text-align: center; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class='ticket-container'>
                <div class='ticket-header'>
                    <h1>🎬 TICKET 🎬</h1>
                    <p>Thanks for using our service!</p>
                </div>
                
                <div class='ticket-body'>
                    <div class='ticket-code'>
                        Code : " + ticket.TicketCode + @"
                    </div>
                    
                    <div class='ticket-info'>
                        <div class='info-row'>
                            <span class='info-label'>Movie: </span>
                            <span class='info-value'>" + ticket.MovieTitle + @"</span>
                        </div>
                        <div class='info-row'>
                            <span class='info-label'>Cinema: </span>
                            <span class='info-value'> " + ticket.CinemaName + @"</span>
                        </div>
                        <div class='info-row'>
                            <span class='info-label'>Date & Time : </span>
                            <span class='info-value'> " + ticket.StartTime.ToString("dd/MM/yyyy HH:mm") + @"</span>
                        </div>
                        <div class='info-row'>
                            <span class='info-label'>Seats : </span>
                            <span class='info-value'> " + string.Join(", ", ticket.SeatsName) + @"</span>
                        </div>
                        <div class='info-row'>
                            <span class='info-label'>Total Price : </span>
                            <span class='info-value'> " + ticket.TotalPrice.ToString("N0") + @" VNĐ</span>
                        </div>
                    </div>
                    
                    <div class='qr-section'>
                        <h3>QR for check-in</h3>
                        <p>Please use this QR Code for check-in</p>
                        <div class='qr-code'>
                            <img src='cid:qr-"+ticket.TicketCode+ @"' alt='QR Code' style='max-width: 200px; height: auto;' />
                           
                        </div>
                        <p><strong>Code:</strong> " + ticket.TicketCode + @"</p>
                    </div>
                </div>
                
                <div class='footer'>
                    <p>This ticket is only used one</p>
                    <p>Please go to cinema before 15 minutes</p>
                    <p>Hotline : 0783481811</p>
                </div>
            </div>
        </body>
        </html>");

            return sb.ToString();
        }

    }


}
