import {ComboInTicketProps, UnAvailableCombosProps} from './combo';
import {CouponInTicketProps} from './coupon';
import {MovieInTicketProps} from './movie';
import {SeatInTicketProps, UnAvailableSeatProps} from './seat';
import {ShowingTimeInTicketProps} from './showingTime';

export interface CreateTicketProps {
  movieId: number;
  cinemaName: string;
  seatIds: number[];
  combos: ComboInTicketProps[];
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

export interface TicketProps {
  ticketId: number;
  ticketCode: string;
  movie: MovieInTicketProps;
  cinemaName: string;
  showingTime: ShowingTimeInTicketProps;
  seats: SeatInTicketProps[];
  totalPriceSeats: number;
  totalPriceCombos: number;
  totalPriceDiscount: number;
  loyalPointsUsed: number;
  totalRankDiscount: number;
  totalPrice: number;
  isActive: boolean;
  usedAt: string;
  createdAt: string;
  combos: ComboInTicketProps[];
  coupon?: CouponInTicketProps;
}

export interface TicketCheckingProps {
  ticketId: number;
  unavailableSeats: UnAvailableSeatProps[];
  unavailableCombos: UnAvailableCombosProps[];
}

export interface MyTicketProps {
  ticketId: number;
  movie: MovieInTicketProps;
  cinemaName: string;
  isActive: boolean;
  usedAt: string | null;
  totalPrice: number;
  showingTime: ShowingTimeInTicketProps;
}
