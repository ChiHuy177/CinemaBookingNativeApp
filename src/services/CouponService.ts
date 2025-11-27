import { ApiResponse } from "../types/apiResponse";
import { CouponProps } from "../types/coupon";
import { COUPON } from "../utils/endpoint";
import axiosInstance from "./BaseService";


export const getCouponsByClient = async (
  clientEmail: string,
): Promise<ApiResponse<CouponProps[]>> => {
  const response = await axiosInstance.get(
    COUPON.GET_COUPONSE_BY_CLIENT(clientEmail),
  );
  return response.data;
};
