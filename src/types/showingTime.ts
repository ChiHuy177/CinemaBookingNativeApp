import {MovieBookingParamProps} from './movie';

export interface ShowingTimeInRoomProps {
  showingTimeId: number;
  startTime: Date;
}

export interface ShowingTimeParamProps {
  movieParam: MovieBookingParamProps;
  cinemaName: string;
  date: string;
  time: string;
  showingTimeId: number;
}

export interface ShowingTimeInTicketProps {
  showingTimeId: number;
  startTime: string;
}
