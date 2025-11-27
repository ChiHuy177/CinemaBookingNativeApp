import {ApiResponse} from '../../types/apiresponse';
import {ReviewAddProps} from '../../types/review';
import axiosInstance from '../client';
import {REVIEW} from '../endpoints';

export const addReview = async (
  data: ReviewAddProps,
): Promise<ApiResponse<string>> => {
  const response = await axiosInstance.post(REVIEW.ADD_REVIEW, data);
  return response.data;
};
