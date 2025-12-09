import { DateInBookingProps } from '../types/date';

export const baseURL =
  'https://deterministic-unagriculturally-maison.ngrok-free.dev';

export const defaultDateForBooking = () => {
  const storeDates: DateInBookingProps[] = [];
  const today = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  for (let i = 0; i < 15; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);

    storeDates.push({
      day: currentDate.getDate().toString(),
      month: monthNames[currentDate.getMonth()],
      dayName: dayNames[currentDate.getDay()],
      fullDate: currentDate.toDateString(),
      dateKey: `${currentDate.getFullYear()}-${
        currentDate.getMonth() + 1
      }-${currentDate.getDate()}`,
    });
  }
  return storeDates;
};

export const SeatRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
export const SeatColumns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
