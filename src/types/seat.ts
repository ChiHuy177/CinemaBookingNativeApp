import { ShowingTimeParamProps } from "./showingTime";


export interface SeatRowForBookingProps {
  row: string;
  seatColumns: SeatColumnForBookingProps[];
}

export interface SeatColumnForBookingProps {
  seatId: number;
  column: number;
  status: 'available' | 'taken' | 'selected' | 'empty';
  seatType: SeatTypeProps | null;
  row: string;
}

export interface SeatTypeProps {
  seatTypeId: number;
  name: string;
  price: number;
}

export interface SeatSelectionParamProps {
  showingTimeParam: ShowingTimeParamProps;
  selectedSeats: SeatColumnForBookingProps[];
  totalPriceSeats: number;
}

export interface UnAvailableSeatProps {
  seatId: number;
  column: number;
  row: string;
}

export interface SeatInTicketProps {
  seatId: number;
  column: string;
  row: string;
}
