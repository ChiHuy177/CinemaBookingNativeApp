// Ticket DTOs
export interface TicketDTO {
  ticketId: number;
  ticketCode: string;
  movie: {
    movieId: number;
    title: string;
    posterURL: string;
    duration: number;
  };
  cinemaName: string;
  showingTime: {
    showingTimeId: number;
    startTime: string;
    endTime: string;
    roomName: string;
  };
  seats: Array<{
    seatId: number;
    seatName: string;
    price: number;
  }>;
  totalPriceSeats: number;
  totalPriceCombos: number;
  totalPriceDiscount: number;
  loyalPointsUsed: number;
  totalRankDiscount: number;
  totalPrice: number;
  isActive: boolean;
  usedAt: string | null;
  createdAt: string;
  combos: Array<{
    comboId: number;
    quantity: number;
    name: string;
  }>;
  coupon: {
    couponId: number;
    code: string;
    discount: number;
  } | null;
}

export interface MyTicketDTO {
  ticketId: number;
  movie: {
    movieId: number;
    title: string;
    posterURL: string;
    duration: number;
  };
  cinemaName: string;
  isActive: boolean;
  usedAt: string | null;
  totalPrice: number;
  showingTime: {
    showingTimeId: number;
    startTime: string;
    endTime: string;
    roomName: string;
  };
}

export interface CreateTicketDTO {
  movieId: number;
  cinemaName: string;
  seatIds: number[];
  combos: Array<{
    comboId: number;
    quantity: number;
  }>;
  totalPrice: number;
  showingTimeId: number;
  totalPriceSeats: number;
  totalPriceCombos: number;
  totalPriceDiscount: number;
  totalRankDiscount: number;
  loyalPointsUsed: number;
  couponId: number | null;
  clientEmail: string;
  movieTitle: string;
}

export interface TicketCheckingDTO {
  ticketId: number | null;
  unavailableSeats: Array<{
    seatId: number;
    seatName: string;
  }>;
  unavailableCombos: Array<{
    comboId: number;
    name: string;
  }>;
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  result: T;
  message?: string;
}
