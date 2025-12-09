// Combo DTOs
export interface ComboDTO {
  comboId: number;
  name: string;
  imageURL: string;
  quantity: number;
  price: number;
}

// Cinema DTOs
export interface CinemaDTO {
  cinemaId: number;
  name: string;
  address: string;
  city: string;
}

// Actor DTOs
export interface ActorDTO {
  actorId: number;
  name: string;
  imageURL: string;
}

export interface CreateActorDTO {
  name: string;
  imageURL: string;
}

// Coupon DTOs
export interface CouponDTO {
  couponId: number;
  code: string;
  discount: number;
  expiryDate: string;
  isActive: boolean;
}

// Review DTOs
export interface ReviewDTO {
  reviewId: number;
  movieId: number;
  clientEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  result: T;
  message?: string;
}
