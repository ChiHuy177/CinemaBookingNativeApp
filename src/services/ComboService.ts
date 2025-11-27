import {ApiResponse} from '../../types/apiresponse';
import {ComboProps} from '../../types/combo';
import axiosInstance from '../client';
import {COMBO} from '../endpoints';

export const getCombos = async (): Promise<ApiResponse<ComboProps[]>> => {
  const response = await axiosInstance.get(COMBO.GET_COMBOS);
  return response.data;
};
