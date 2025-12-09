using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using CinemaBookingApp.Models.Entities;
using static CinemaBookingApp.Models.DTOs.Rank;

namespace CinemaBookingApp.Models.DTOs
{
    public class Client
    {
        public class ClientInReviewDTO
        {
            public string Name { get; set; }

            public string Avatar { get; set; }
        }


        public class  ClientProfileDTO
        {
            public long ClientId { get; set; }

            public string Name { get; set; }

            public string Email { get; set; }

            public string PhoneNumber { get; set; }

            public DateTime DoB { get; set; }

            public string City { get; set; }

            public string Address { get; set; }

            public bool Genre { get; set; }

            public double LoyalPoints { get; set; }

            public RankDTO Rank { get; set; }

            public string Avatar { get; set; }

        }


        public class EditClientProfileDTO
        {
            public long ClientId { get; set; }

            public string Name { get; set; }

            public string Email { get; set; }

            public string PhoneNumber { get; set; }

            public DateTime DoB { get; set; }

            public string City { get; set; }

            public string Address { get; set; }

            public bool Genre { get; set; }
        }

        public class ChangePasswordClientDTO
        {
            public string Email { get; set; }

            public string CurrentPassword { get; set; }

            public string NewPassword { get; set; }

            public string ConfirmNewPassword { get; set; }
        }
    }
}
