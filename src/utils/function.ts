import Toast from 'react-native-toast-message';
import {ToastProps} from '../types/toast';
import {ErrorFetchingProps} from '../types/errorFetching';
import axios from 'axios';
import {format} from 'date-fns';

import {CinemaForBookingProps} from '../types/cinema';
import dayjs from 'dayjs';
import { baseURL } from '../constant/variable';

export const getAgeRatingFromRequireAge = (requireAge: number) => {
  if (requireAge === 0 || requireAge == null) {
    return 'P';
  }
  if (requireAge >= 18) {
    return 'T18';
  }
  if (requireAge >= 16) {
    return 'T16';
  }
  if (requireAge >= 13) {
    return 'T13';
  }
  return 'P';
};

export const getAgeRatingColor = (requireAge: number) => {
  const ageRating = getAgeRatingFromRequireAge(requireAge);
  if (ageRating === 'P') {
    return '#4CAF50';
  }
  if (ageRating === 'T13') {
    return '#FFC107';
  }
  if (ageRating === 'T16') {
    return '#FF8133';
  }
  if (ageRating === 'T18') {
    return '#F44336';
  }
  return '#C5C5C5';
};

export const showToast = (props: ToastProps) => {
  Toast.show({
    type: props.type,
    text1: props.text1.toUpperCase(),
    text2: props?.text2,
  });
};

export const checkErrorFetchingData = (data: ErrorFetchingProps): void => {
  if (axios.isAxiosError(data.error)) {
    if (data.error.response) {
      const message = data.error.response.data?.Message || 'Errors';

      showToast({
        type: 'error',
        text1: `${data.title}`,
        text2: `${message}`,
      });
    }
  }
};

export const formatDateOfBirth = (dateInput: string | Date): string => {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getCitiesAPI = async () => {
  const response = await axios.get(
    'https://provinces.open-api.vn/api/?depth=1',
  );
  const cityOptions = response.data.map((city: {name: string}) => ({
    label: city.name,
    value: city.name,
  }));
  return cityOptions;
};

export const getPosterImage = (posterURL: string) => {
  return `${baseURL}/images/posters/${posterURL}`;
};

export const getActorImage = (actorURL: string) => {
  return `${baseURL}/images/actors/${actorURL}`;
};

export const getClientImage = (clientURL: string) => {
  return `${baseURL}/images/clients/${clientURL}`;
};

export const getComboImgae = (comboURL: string) => {
  return `${baseURL}/images/combos/${comboURL}`;
};

export function formatDate(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

export const getVideoId = (url: string) => {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  );
  return match ? match[1] : null;
};

export const formatMinutesToHours = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes} phút`;
  }

  if (minutes === 0) {
    return `${hours} giờ`;
  }

  return `${hours} giờ ${minutes} phút`;
};

export const formatDateToHourseAndMinutes = (date: Date): string => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const getRelativeTimeFromNow = (dateString: string | Date): string => {
  const date =
    typeof dateString === 'string' ? new Date(dateString) : dateString;
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();

  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return 'recently';
  }
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  if (diffInDays < 30) {
    return `${diffInDays}d ago`;
  }

  return date.toLocaleDateString('vi-VN');
};

export const filterSuitableCinemasForBooking = (
  cinemas: CinemaForBookingProps[],
  selectedDate: Date,
) => {
  const formattedSelectedDate = formatDate(selectedDate);
  const filteredCinemas = cinemas
    .map(cinema => {
      const filteredRooms = cinema.rooms
        .map(room => {
          const filteredTimes = room.showingTimes.filter(
            time => formatDate(time.startTime) === formattedSelectedDate,
          );
          if (filteredTimes.length > 0) {
            return {...room, showingTimes: filteredTimes};
          }
          return null;
        })
        .filter(room => room !== null);

      if (filteredRooms.length > 0) {
        return {...cinema, rooms: filteredRooms};
      }
      return null;
    })
    .filter(cinema => cinema !== null);

  return filteredCinemas;
};

export const formatDateAndTimeForBooking = (date: string, time: string) => {
  const dateArr = date.split('-');
  const numberOfMonth = dateArr[1].length;
  const numberOfDay = dateArr[2].length;

  let stringMonth = '';
  for (let i = 0; i < numberOfMonth; i++) {
    stringMonth += 'M';
  }

  let stringDay = '';
  for (let i = 0; i < numberOfDay; i++) {
    stringDay += 'D';
  }

  const timeArr = time.split(':');
  const numberOfHour = timeArr[0].length;
  const numberOfMinute = timeArr[1].length;

  let stringHour = '';
  let stringMinute = '';

  for (let i = 0; i < numberOfHour; i++) {
    stringHour += 'H';
  }

  for (let i = 0; i < numberOfMinute; i++) {
    stringMinute += 'm';
  }

  const stringFormat = `YYYY-${stringMonth}-${stringDay} ${stringHour}:${stringMinute}`;

  console.log(stringFormat);

  return dayjs(`${date} ${time}`, `${stringFormat}`);
};


