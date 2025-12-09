// Genre DTOs
export interface GenreDTO {
  genreId: number;
  name: string;
}

export interface CreateGenreDTO {
  name: string;
}

export interface UpdateGenreDTO {
  name: string;
}

// API Response
export interface ApiResponse<T> {
  success: boolean;
  result: T;
  message?: string;
}
