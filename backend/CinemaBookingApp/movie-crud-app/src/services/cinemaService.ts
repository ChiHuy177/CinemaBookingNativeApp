import type { ApiResponse, CinemaDTO } from '../types/common.types';
import { API_CONFIG } from '../config/api.config';

const API_BASE_URL = `${API_CONFIG.BASE_URL}/api/cinema`;

const getAuthToken = (): string => {
  return localStorage.getItem('authToken') || '';
};

const getHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`
});

export const cinemaService = {
  // GET - Lấy tất cả cinemas
  getAllCinemas: async (): Promise<CinemaDTO[]> => {
    try {
      const response = await fetch(API_BASE_URL, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch cinemas');
      const data: ApiResponse<CinemaDTO[]> = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching cinemas:', error);
      throw error;
    }
  },

  // GET - Lấy cinema theo ID
  getCinemaById: async (id: number): Promise<CinemaDTO> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch cinema');
      const data: ApiResponse<CinemaDTO> = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error fetching cinema:', error);
      throw error;
    }
  }
};
