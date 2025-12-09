import type { ApiResponse, CreateActorDTO } from '../types/common.types';
import { API_CONFIG } from '../config/api.config';

const API_BASE_URL = `${API_CONFIG.BASE_URL}/api/actor`;

const getAuthToken = (): string => {
  return localStorage.getItem('authToken') || '';
};

const getHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`
});

export const actorService = {
  // GET - Lấy tất cả actors
  getAllActors: async (): Promise<any[]> => {
    try {
      const response = await fetch(API_BASE_URL, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch actors');
      const data: ApiResponse<any[]> = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching actors:', error);
      throw error;
    }
  },

  // POST - Tạo actor mới
  createActor: async (actorData: CreateActorDTO): Promise<string> => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(actorData)
      });
      if (!response.ok) throw new Error('Failed to create actor');
      const data: ApiResponse<string> = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error creating actor:', error);
      throw error;
    }
  }
};
