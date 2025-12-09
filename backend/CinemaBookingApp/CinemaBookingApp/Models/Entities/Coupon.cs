using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CinemaBookingApp.Models.Entities
{
    public class Coupon
    {
        [Key]
        public long CouponId { get; set; }

        [Required]
        [StringLength(50)]
        public string Code { get; set; }

        [Required]
        public double DiscountAmount { get; set; }

        public DateTime ExpiryDate { get; set; }

        
        public ICollection<CouponUser> CouponUsers { get; set; }

        public ICollection<Ticket>? Tickets { get; set; }
    }
}
