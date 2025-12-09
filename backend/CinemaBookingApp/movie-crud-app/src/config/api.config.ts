// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5199',
  AUTH_ENDPOINT: '/api/auth',
  MOVIE_ENDPOINT: '/api/movie',
  
  // Helper methods
  getAuthUrl: () => `${API_CONFIG.BASE_URL}${API_CONFIG.AUTH_ENDPOINT}`,
  getMovieUrl: () => `${API_CONFIG.BASE_URL}${API_CONFIG.MOVIE_ENDPOINT}`,
  getImageUrl: (path: string) => `${API_CONFIG.BASE_URL}/images/posters/${path}`,
  getComboUrl: (path: string) => `${API_CONFIG.BASE_URL}/images/combos/${path}`,
};
