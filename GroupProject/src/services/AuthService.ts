

import { ApiResponse } from '../types/apiResponse';
import { LoginRequest, LoginResponse, RegisterRequest, ResetPasswordRequestProps } from '../types/auth';
import { AUTH } from '../utils/endpoint';
import { resetToLogin } from '../utils/navigation';
import { clearUserAndToken } from '../utils/storage';
import axiosInstance from './BaseService';

export const login = async (
  data: LoginRequest,
): Promise<ApiResponse<LoginResponse>> => {
  const response = await axiosInstance.post(AUTH.LOGIN, data);
  return response.data;
};

export const register = async (
  data: RegisterRequest,
): Promise<ApiResponse<string>> => {
  const response = await axiosInstance.post(AUTH.REGISTER, data);
  return response.data;
};

export const sendResetPasswordCode = async (
  data: string,
): Promise<ApiResponse<string>> => {
  const response = await axiosInstance.post(
    AUTH.SEND_RESET_PASSWORD_CODE,
    data,
  );
  return response.data;
};

export const resendResetPasswordCode = async (
  data: string,
): Promise<ApiResponse<string>> => {
  const response = await axiosInstance.post(
    AUTH.RESEND_RESET_PASSWORD_CODE,
    data,
  );
  return response.data;
};

export const resetPassword = async (
  data: ResetPasswordRequestProps,
): Promise<ApiResponse<string>> => {
  const response = await axiosInstance.post(AUTH.RESET_PASSWORD, data);
  return response.data;
};

export const logout = async () => {
  await clearUserAndToken();
  resetToLogin();
};
