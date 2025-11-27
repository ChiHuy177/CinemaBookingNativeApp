export interface CouponProps {
  couponId: number;
  code: string;
  discountAmount: number;
  expiryDate: Date;
}

export interface CouponInTicketProps {
  code: string;
  discountAmount: number;
}
