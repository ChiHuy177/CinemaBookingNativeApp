import type { 
  ApiResponse, 
  MovieDTO, 
  CreateMovieDTO, 
  UpdateMovieDTO, 
  MovieDetailHomeDTO,
  MovieSearchDTO 
} from '../types/movie.types';
import { API_CONFIG } from '../config/api.config';

const API_BASE_URL = API_CONFIG.getMovieUrl();

// Lưu token vào localStorage (giả sử bạn đã có token từ login)
const getAuthToken = (): string => {
  return localStorage.getItem('authToken') || '';
};

const getHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getAuthToken()}`
});

export const movieService = {
  // GET - Lấy tất cả movies
  getAllMovies: async (): Promise<MovieDTO[]> => {
    try {
      const response = await fetch(API_BASE_URL, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch movies');
      const data: ApiResponse<MovieDTO[]> = await response.json();
      console.log(data);
      return data.result || [];
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error;
    }
  },

  // GET - Lấy movie theo ID
  getMovieById: async (id: number): Promise<MovieDTO> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch movie');
      const data: ApiResponse<MovieDTO> = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error fetching movie:', error);
      throw error;
    }
  },

  // GET - Lấy chi tiết movie
  getMovieDetail: async (id: number): Promise<MovieDetailHomeDTO> => {
    try {
      const response = await fetch(`${API_BASE_URL}/detail/${id}`, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch movie detail');
      const data: ApiResponse<MovieDetailHomeDTO> = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error fetching movie detail:', error);
      throw error;
    }
  },

  // POST - Tạo movie mới
  createMovie: async (movieData: CreateMovieDTO, posterFile?: File): Promise<MovieDTO> => {
    try {
      const formData = new FormData();
      
      // Thêm tất cả các trường vào FormData
      formData.append('title', movieData.title);
      formData.append('description', movieData.description);
      formData.append('duration', movieData.duration.toString());
      formData.append('director', movieData.director);
      formData.append('releaseDate', movieData.releaseDate);
      formData.append('trailerURL', movieData.trailerURL || '');
      formData.append('company', movieData.company);
      formData.append('language', movieData.language);
      
      if (movieData.requireAge !== null && movieData.requireAge !== undefined) {
        formData.append('requireAge', movieData.requireAge.toString());
      }
      
      // Thêm file nếu có
      if (posterFile) {
        formData.append('posterFile', posterFile);
      } else if (movieData.posterURL) {
        formData.append('posterURL', movieData.posterURL);
      }
      
      // Chỉ thêm genreIDs nếu có data
      if (movieData.genreIDs && movieData.genreIDs.length > 0) {
        movieData.genreIDs.forEach((id) => {
          formData.append('genreIDs', id.toString());
        });
      }
      
      // Chỉ thêm createMovieActorDTOs nếu có data
      if (movieData.createMovieActorDTOs && movieData.createMovieActorDTOs.length > 0) {
        movieData.createMovieActorDTOs.forEach((actor, index) => {
          formData.append(`createMovieActorDTOs[${index}].actorId`, actor.actorId.toString());
          formData.append(`createMovieActorDTOs[${index}].characterName`, actor.characterName);
        });
      }

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
          // Không set Content-Type, để browser tự động set với boundary
        },
        body: formData
      });
      if (!response.ok) throw new Error('Failed to create movie');
      const data: ApiResponse<MovieDTO> = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error creating movie:', error);
      throw error;
    }
  },

  // PUT - Cập nhật movie
  updateMovie: async (id: number, movieData: UpdateMovieDTO, posterFile?: File): Promise<string> => {
    try {
      const formData = new FormData();
      
      // Thêm tất cả các trường vào FormData
      formData.append('title', movieData.title);
      formData.append('description', movieData.description);
      formData.append('duration', movieData.duration.toString());
      formData.append('director', movieData.director);
      formData.append('releaseDate', movieData.releaseDate);
      formData.append('trailerURL', movieData.trailerURL || '');
      formData.append('requireAge', movieData.requireAge.toString());
      formData.append('company', movieData.company);
      formData.append('language', movieData.language);
      
      // Thêm file nếu có
      if (posterFile) {
        formData.append('posterFile', posterFile);
      } else if (movieData.posterURL) {
        formData.append('posterURL', movieData.posterURL);
      }

      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
          // Không set Content-Type, để browser tự động set với boundary
        },
        body: formData
      });
      if (!response.ok) throw new Error('Failed to update movie');
      const data: ApiResponse<string> = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error updating movie:', error);
      throw error;
    }
  },

  // DELETE - Xóa movie
  deleteMovie: async (id: number): Promise<string> => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Failed to delete movie');
      const data: ApiResponse<string> = await response.json();
      return data.result;
    } catch (error) {
      console.error('Error deleting movie:', error);
      throw error;
    }
  },

  // GET - Tìm kiếm movies
  searchMovies: async (searchTerm: string): Promise<MovieSearchDTO[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/search?value=${encodeURIComponent(searchTerm)}`, {
        headers: getHeaders()
      });
      if (!response.ok) throw new Error('Failed to search movies');
      const data: ApiResponse<MovieSearchDTO[]> = await response.json();
      return data.result || [];
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  }
};
