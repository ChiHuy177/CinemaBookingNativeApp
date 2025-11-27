import { ApiResponse } from "../types/apiResponse";
import { SeatRowForBookingProps } from "../types/seat";
import { SEAT } from "../utils/endpoint";
import axiosInstance from "./BaseService";


export const getSeatRowsForBooking = async (
  showingTimeId: number,
): Promise<ApiResponse<SeatRowForBookingProps[]>> => {
  const response = await axiosInstance.get(
    SEAT.GET_SEAT_ROWS_FOR_BOOKING(showingTimeId),
  );
  return response.data;
};
