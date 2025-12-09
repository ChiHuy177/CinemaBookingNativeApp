import type { ApiResponse, GenreDTO, CreateGenreDTO, UpdateGenreDTO } from '../types/genre.types';
import { API_CONFIG } from '../config/api.config';

const API_BASE_URL = `${API_CONFIG.BASE_URL}/api/genre`;

const getAuthToken = (): string => {
  return localStorage.getItem('authToken') || '';
};

const getHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`
});

export const genreService = {
  // GET - Lấy tất cả genres
  getAllGenres: async (): Promise<GenreDTO[]> => {
    try {
      const response = await fetch(API_BASE_URL, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch genres');
      const data: ApiResponse<GenreDTO[]> = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error fetching genres:', error);
      throw error;
    }
  },

  // GET - Lấy genre theo ID
  getGenreById: async (id: number): Promise<GenreDTO> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch genre');
      const data: ApiResponse<GenreDTO> = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error fetching genre:', error);
      throw error;
    }
  },

  // POST - Tạo genre mới
  createGenre: async (genreData: CreateGenreDTO): Promise<GenreDTO> => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(genreData)
      });
      if (!response.ok) throw new Error('Failed to create genre');
      const data: ApiResponse<GenreDTO> = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error creating genre:', error);
      throw error;
    }
  },

  // PUT - Cập nhật genre
  updateGenre: async (id: number, genreData: UpdateGenreDTO): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(genreData)
      });
      if (!response.ok) throw new Error('Failed to update genre');
      const data: ApiResponse<string> = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error updating genre:', error);
      throw error;
    }
  },

  // DELETE - Xóa genre
  deleteGenre: async (id: number): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Failed to delete genre');
      const data: ApiResponse<string> = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error deleting genre:', error);
      throw error;
    }
  }
};
