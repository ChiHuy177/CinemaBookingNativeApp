namespace CinemaBookingApp.Models.DTOs
{
    public class Coupon
    {
        public class CouponCreateDTO
        {
            public string Code { get; set; }

            public double DiscountAmount { get; set; }

            public DateTime ExpiryDate { get; set; }
        }

        public class CouponDTO
        {
            public string Code { get; set; }

            public double DiscountAmount { get; set; }

            public DateTime ExpiryDate { get; set; }

            public long CouponId { get; set; }
        }

        public class CouponInTicketDTO
        {
            public string? Code { get; set; }

            public double DiscountAmount { get; set; }
        }
    }
}
