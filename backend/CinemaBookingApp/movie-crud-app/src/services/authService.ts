import type { ApiResponse, LoginRequestDTO, LoginResponseDTO, RegisterRequestDTO } from '../types/auth.types';
import { API_CONFIG } from '../config/api.config';

const API_BASE_URL = API_CONFIG.getAuthUrl();

const getHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json'
});

export const authService = {
  // POST - Login
  login: async (credentials: LoginRequestDTO): Promise<LoginResponseDTO> => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(credentials)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đăng nhập thất bại');
      }
      
      const data: ApiResponse<LoginResponseDTO> = await response.json();
      
      // Lưu token vào localStorage
      if (data.result.token) {
        localStorage.setItem('authToken', data.result.token);
        localStorage.setItem('userEmail', data.result.email);
      }
      
      return data.result;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  // POST - Register
  register: async (userData: RegisterRequestDTO): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đăng ký thất bại');
      }
      
      const data: ApiResponse<string> = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  },

  // Logout
  logout: (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('authToken');
    return !!token;
  },

  // Get current user email
  getCurrentUserEmail: (): string | null => {
    return localStorage.getItem('userEmail');
  },

  // Get auth token
  getToken: (): string | null => {
    return localStorage.getItem('authToken');
  }
};
