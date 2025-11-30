import {SeatColumnForBookingProps} from '../types/seat';

export const colors = {
  primary: '#ff8133',
  dark: '#2f2f2f',
  mediumGray: '#3d3d3d',
  lightGray: '#c5c5c5',
  white: '#ffffff',
  black: '#000000',
  green: '#4CAF50',
  red: '#f44336',
  gold: '#ffd700',
  pink: '#e91e63',
};

export const getRankColor = (rank: string) => {
  switch (rank) {
    case 'NONE':
      return '#808080';
    case 'SILVER':
      return '#C0C0C0';
    case 'GOLD':
      return '#FFD700';
    case 'PLATINUM':
      return '#00D4FF';
    default:
      return '#808080';
  }
};

export const getSeatColor = (seat: SeatColumnForBookingProps) => {
  if (seat.seatType == null) {
    return 'transparent';
  }

  if (seat.status === 'taken') {
    return colors.mediumGray;
  }

  if (seat.status === 'selected') {
    return colors.primary;
  }

  switch (seat.seatType?.name) {
    case 'Normal':
      return colors.lightGray;
    case 'VIP':
      return colors.green;
    case 'Sweet Box':
      return colors.pink;
    case 'GOLD CLASS':
      return colors.gold;
    default:
      return colors.lightGray;
  }
};
