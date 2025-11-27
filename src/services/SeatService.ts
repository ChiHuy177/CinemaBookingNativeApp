import {ApiResponse} from '../../types/apiresponse';
import {SeatRowForBookingProps} from '../../types/seat';
import axiosInstance from '../client';
import {SEAT} from '../endpoints';

export const getSeatRowsForBooking = async (
  showingTimeId: number,
): Promise<ApiResponse<SeatRowForBookingProps[]>> => {
  const response = await axiosInstance.get(
    SEAT.GET_SEAT_ROWS_FOR_BOOKING(showingTimeId),
  );
  return response.data;
};
