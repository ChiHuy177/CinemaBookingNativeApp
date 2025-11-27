import {ApiResponse} from '../../types/apiresponse';
import {
  ChangePasswordProfileProps,
  ClientProfileProps,
} from '../../types/client';
import axiosInstance from '../client';
import {CLIENT} from '../endpoints';

export const getClient = async (): Promise<ApiResponse<ClientProfileProps>> => {
  const response = await axiosInstance.get(CLIENT.GET_CLIENT);
  return response.data;
};

export const updateClient = async (
  formData: FormData,
): Promise<ApiResponse<string>> => {
  const response = await axiosInstance.request({
    method: 'PUT',
    url: CLIENT.UPDATE_CLIENT,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const changePasswordClient = async (
  data: ChangePasswordProfileProps,
): Promise<ApiResponse<string>> => {
  const response = await axiosInstance.put(CLIENT.CHANGE_PASSWORD_CLIENT, data);
  return response.data;
};

export const getLoyalPoints = async (
  email: string,
): Promise<ApiResponse<number>> => {
  const response = await axiosInstance.get(CLIENT.GET_LOYAL_POINTS(email));
  return response.data;
};
