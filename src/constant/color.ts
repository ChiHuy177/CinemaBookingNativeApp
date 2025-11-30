import {SeatColumnForBookingProps} from '../types/seat';

export const colors = {
  primary: '#FF3B30', // Bright Red/Coral accent matching HomeScreen
  dark: '#10111D', // Dark cinematic background matching HomeScreen
  mediumGray: '#1F2130', // Card background matching HomeScreen
  lightGray: '#8F90A6', // Muted gray text matching HomeScreen
  white: '#ffffff',
  black: '#000000',
  green: '#4CAF50',
  red: '#f44336',
  gold: '#ffd700',
  pink: '#e91e63',
  textPlaceholder: '#5C5E6F', // Placeholder text matching HomeScreen
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
