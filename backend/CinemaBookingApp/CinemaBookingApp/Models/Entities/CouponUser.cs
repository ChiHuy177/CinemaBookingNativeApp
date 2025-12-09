using System.ComponentModel.DataAnnotations.Schema;

namespace CinemaBookingApp.Models.Entities
{
    public class CouponUser
    {
        public long ClientId { get; set; }

        [ForeignKey("ClientId")]
        public Client Client { get; set; }

        public long CouponId { get; set; }

        [ForeignKey("CouponId")]
        public Coupon Coupon { get; set; }

        public bool IsUsed { get; set; }
    }
}
