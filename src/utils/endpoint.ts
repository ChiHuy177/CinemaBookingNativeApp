export const MOVIE = {
  MOVIES: '/movie',
  MOVIE_DETAIL: (id: number) => `/movie/${id}`,
  UPDATE_MOVIE: (id: number) => `/movie/${id}`,
  DELETE_MOVIE: (id: number) => `/movie/${id}`,
  MOVIE_DETAIL_FOR_BOOKING: (id: number) => `/movie/detail/${id}`,
  ADD_FAVORITE_MOVIE: (id: number) => `/movie/${id}/addFavorite`,
  REMOVE_FAVORITE_MOVIE: (id: number) => `/movie/${id}/removeFavorite`,
  SEARCH_MOVIE: (value: string) => `/movie/search?value=${value}`,
  MAIN_HOME: 'movie/mainHome',
  FAVORITE_MOVIES: 'movie/favoriteMovies',
  GET_MOVIES_BY_CINEMA_ID: (cinemaId: number, date: string) =>
    `/movie/byCinema?cinemaId=${cinemaId}&date=${date}`,
};

export const AUTH = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  SEND_RESET_PASSWORD_CODE: '/auth/sendResetPasswordCode',
  RESEND_RESET_PASSWORD_CODE: '/auth/resendResetPasswordCode',
  RESET_PASSWORD: '/auth/resetPassword',
};

export const CINEMA = {
  CINEMAS: '/cinema',
  CINEMA_DETAIL: (id: number) => `/cinema/${id}`,
  CINEMAS_FOR_BOOKING: '/cinema/booking',
  GET_CINEMAS_FOR_BOOKING: (movieId: number) => `/cinema/booking/${movieId}`,
};

export const GENRE = {
  GENRES: '/genre',
  CREATE_GENRE: '/genre',
  GENRE_DETAIL: (id: number) => `/genre/${id}`,
  UPDATE_GENRE: (id: number) => `/genre/${id}`,
  DELETE_GENRE: (id: number) => `/genre/${id}`,
};

export const CLIENT = {
  GET_CLIENT: '/client',
  UPDATE_CLIENT: '/client',
  CHANGE_PASSWORD_CLIENT: '/client/changePassword',
  GET_LOYAL_POINTS: (email: string) => `/client/loyalPoints/${email}`,
};

export const REVIEW = {
  ADD_REVIEW: '/review',
};

export const COUPON = {
  GET_COUPONSE_BY_CLIENT: (clientEmail: string) => `/coupon/${clientEmail}`,
};

export const SEAT = {
  GET_SEAT_ROWS_FOR_BOOKING: (showingTimeId: number) =>
    `/seat/booking/${showingTimeId}`,
};

export const COMBO = {
  GET_COMBOS: '/combo',
};

export const TICKET = {
  GET_MY_TICKETS: '/ticket',
  ADD_TICKET: '/ticket',
  GET_TICKET: (ticketId: number) => `/ticket/${ticketId}`,
};

export const RANK = {
  GET_RANK_BY_CLIENT_EMAIL: (clientEmail: string) =>
    `/rank/client/${clientEmail}`,
};
