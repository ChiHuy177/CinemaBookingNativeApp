import axios from 'axios';

import { baseURL } from '../constant/variable';
import { getEmailAndToken } from '../utils/storage';
import { logout } from './AuthService';


const axiosInstance = axios.create({
  // baseURL: 'https://localhost:7092/api',

  baseURL: `${baseURL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async config => {
    const auth = await getEmailAndToken();
    if (auth) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 403) {
      logout();
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
