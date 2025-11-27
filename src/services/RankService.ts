import {ApiResponse} from '../../types/apiresponse';
import {ClientRankProps} from '../../types/rank';
import axiosInstance from '../client';
import {RANK} from '../endpoints';

export const getClientRank = async (
  clientEmail: string,
): Promise<ApiResponse<ClientRankProps>> => {
  const response = await axiosInstance.get(
    RANK.GET_RANK_BY_CLIENT_EMAIL(clientEmail),
  );

  return response.data;
};
