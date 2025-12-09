using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CinemaBookingApp.Models.Entities
{
    public class Client
    {
        [Key]
        public long ClientId { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [StringLength(20)]
        public string PhoneNumber { get; set; }

        [Column(TypeName = "date")]
        public DateTime DoB { get; set; }

        [Required]
        public string City { get; set; }

        public string Address { get; set; }

        [Required]
        public bool Genre { get; set; }

        public double LoyalPoints { get; set; } = 0;

        public bool IsDelete { get; set; } = false;

        public long? RankId { get; set; } = 1;

        public string Avatar { get; set; } = "default.jpg";

        [ForeignKey("RankId")]
        public Rank Rank { get; set; }

        public ICollection<Ticket> Tickets { get; set; }
        public ICollection<Review> Reviews { get; set; }
        public ICollection<CouponUser> CouponUsers { get; set; }

        public ICollection<Favorite> Favorites { get; set; }
    }
}
