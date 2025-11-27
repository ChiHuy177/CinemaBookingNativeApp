import {ApiResponse} from '../../types/apiresponse';
import {CouponProps} from '../../types/coupon';
import axiosInstance from '../client';
import {COUPON} from '../endpoints';

export const getCouponsByClient = async (
  clientEmail: string,
): Promise<ApiResponse<CouponProps[]>> => {
  const response = await axiosInstance.get(
    COUPON.GET_COUPONSE_BY_CLIENT(clientEmail),
  );
  return response.data;
};
