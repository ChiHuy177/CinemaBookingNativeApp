import { ApiResponse } from "../types/apiResponse";
import { MovieMainHomeProps, MovieListProps, MovieDetailProps } from "../types/movie";
import { MOVIE } from "../utils/endpoint";
import axiosInstance from "./BaseService";



export const movieMainHome = async (): Promise<
  ApiResponse<MovieMainHomeProps[]>
> => {
  const response = await axiosInstance.get(MOVIE.MAIN_HOME);
  return response.data;
};

export const searchMovies = async (
  searchValue: string,
): Promise<ApiResponse<MovieListProps[]>> => {
  const response = await axiosInstance.get(MOVIE.SEARCH_MOVIE(searchValue));
  return response.data;
};

export const movieDetailForBooking = async (
  id: number,
): Promise<ApiResponse<MovieDetailProps>> => {
  const response = await axiosInstance.get(MOVIE.MOVIE_DETAIL_FOR_BOOKING(id));
  return response.data;
};

export const addFavoriteMovie = async (
  id: number,
): Promise<ApiResponse<number>> => {
  const response = await axiosInstance.post(MOVIE.ADD_FAVORITE_MOVIE(id));
  return response.data;
};

export const removeFavoriteMovie = async (
  id: number,
): Promise<ApiResponse<number>> => {
  const response = await axiosInstance.post(MOVIE.REMOVE_FAVORITE_MOVIE(id));
  return response.data;
};

export const getFavoriteMovies = async (): Promise<
  ApiResponse<MovieListProps[]>
> => {
  const response = await axiosInstance.get(MOVIE.FAVORITE_MOVIES);
  return response.data;
};

export const getMoviesByCinema = async (
  cinemaId: number,
  date: string,
): Promise<ApiResponse<MovieListProps[]>> => {
  const response = await axiosInstance.get(
    MOVIE.GET_MOVIES_BY_CINEMA_ID(cinemaId, date),
  );
  return response.data;
};
