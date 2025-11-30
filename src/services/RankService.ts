import { ApiResponse } from "../types/apiResponse";
import { ClientRankProps } from "../types/rank";
import { RANK } from "../utils/endpoint";
import axiosInstance from "./BaseService";

export const getClientRank = async (
  clientEmail: string,
): Promise<ApiResponse<ClientRankProps>> => {
  const response = await axiosInstance.get(
    RANK.GET_RANK_BY_CLIENT_EMAIL(clientEmail),
  );

  return response.data;
};
