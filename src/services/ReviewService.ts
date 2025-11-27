import { ApiResponse } from "../types/apiResponse";
import { ReviewAddProps } from "../types/review";
import { REVIEW } from "../utils/endpoint";
import axiosInstance from "./BaseService";

export const addReview = async (
  data: ReviewAddProps,
): Promise<ApiResponse<string>> => {
  const response = await axiosInstance.post(REVIEW.ADD_REVIEW, data);
  return response.data;
};
