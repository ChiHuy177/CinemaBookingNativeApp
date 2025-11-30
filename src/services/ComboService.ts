import { ApiResponse } from "../types/apiResponse";
import { ComboProps } from "../types/combo";
import { COMBO } from "../utils/endpoint";
import axiosInstance from "./BaseService";

export const getCombos = async (): Promise<ApiResponse<ComboProps[]>> => {
  const response = await axiosInstance.get(COMBO.GET_COMBOS);
  return response.data;
};
