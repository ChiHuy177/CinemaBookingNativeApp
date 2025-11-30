import {GenreProps} from './genre';
import {MovieActorProps} from './movieActor';
import {ReviewInMovieDetailProps} from './review';

export interface MovieMainHomeProps {
  movieId: number;
  releaseDate: Date;
  posterURL: string;
  title: string;
}

export interface FavoriteMovieBaseProps {
  isFavorite: boolean;
  totalLike: number;
}

export interface MovieListProps extends FavoriteMovieBaseProps {
  movieId: number;
  title: string;
  duration: number;
  releaseDate: Date;
  posterURL: string;
  requireAge: number | null;
  rating: number;
  genres: string[];
}

export interface MovieDetailProps extends FavoriteMovieBaseProps {
  movieId: number;
  title: string;
  description: string;
  duration: number;
  director: string;
  posterURL: string;
  trailerURL: string;
  requireAge: number | null;
  company: string;
  language: string;
  rating: number;
  movieActors: MovieActorProps[];
  genres: GenreProps[];
  reviews: ReviewInMovieDetailProps[];
}

export interface MovieBookingParamProps {
  movieId: number;
  movieTitle: string;
  poster: string;
}

export interface MovieInTicketProps {
  movieId: number;
  title: string;
}
