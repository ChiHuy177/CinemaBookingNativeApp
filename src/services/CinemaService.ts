import {ApiResponse} from '../../types/apiresponse';
import {CinemaForBookingProps, CityData} from '../../types/cinema';
import axiosInstance from '../client';
import {CINEMA} from '../endpoints';

export const getCinemaForBooking = async (
  movieId: number,
): Promise<ApiResponse<CinemaForBookingProps[]>> => {
  const response = await axiosInstance.get(
    CINEMA.GET_CINEMAS_FOR_BOOKING(movieId),
  );
  return response.data;
};

export const getAllCinemasForBooking = async (): Promise<
  ApiResponse<CityData[]>
> => {
  const response = await axiosInstance.get(CINEMA.CINEMAS_FOR_BOOKING);
  return response.data;
};
