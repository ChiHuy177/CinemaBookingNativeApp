import type { ApiResponse, ComboDTO } from '../types/common.types';
import { API_CONFIG } from '../config/api.config';

const API_BASE_URL = `${API_CONFIG.BASE_URL}/api/combo`;

const getAuthToken = (): string => {
  return localStorage.getItem('authToken') || '';
};

const getHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`
});

export const comboService = {
  // GET - Lấy tất cả combos
  getAllCombos: async (): Promise<ComboDTO[]> => {
    try {
      const response = await fetch(API_BASE_URL, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch combos');
      const data: ApiResponse<ComboDTO[]> = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching combos:', error);
      throw error;
    }
  }
};
