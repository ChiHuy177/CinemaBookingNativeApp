// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  result: T;
  message?: string;
}

// Movie DTOs
export interface MovieDTO {
  movieId: number;
  title: string;
  description: string;
  duration: number;
  director: string;
  releaseDate: string;
  posterURL: string;
  trailerURL: string;
  totalBooking: number;
  requireAge: number | null;
  company: string;
  language: string;
  totalLike: number;
  isAvailable: boolean;
}

export interface CreateMovieDTO {
  title: string;
  description: string;
  duration: number;
  director: string;
  releaseDate: string;
  posterURL: string;
  trailerURL: string;
  requireAge: number | null;
  company: string;
  language: string;
  genreIDs: number[];
  createMovieActorDTOs: CreateMovieActorDTO[];
}

export interface UpdateMovieDTO {
  title: string;
  description: string;
  duration: number;
  director: string;
  releaseDate: string;
  posterURL: string;
  trailerURL: string;
  requireAge: number;
  company: string;
  language: string;
}

export interface MovieDetailHomeDTO {
  movieId: number;
  title: string;
  description: string;
  duration: number;
  director: string;
  posterURL: string;
  trailerURL: string;
  requireAge: number;
  company: string;
  language: string;
  totalLike: number;
  isFavorite: boolean;
  rating: number;
  movieActors: MovieActorInDetailMovieDTO[];
  reviews: ReviewInMovieDetailDTO[];
  genres: GenreDTO[];
}

export interface MovieSearchDTO {
  movieId: number;
  title: string;
  duration: number;
  releaseDate: string;
  posterURL: string;
  requireAge: number | null;
  totalLike: number;
  rating: number;
  isFavorite: boolean;
  genres: string[];
}

export interface MovieMainHomeDTO {
  movieId: number;
  releaseDate: string;
  posterURL: string;
  totalLike: number;
  totalBooking: number;
  title: string;
}

export interface FavoriteMovieDTO extends MovieSearchDTO {}

// Supporting DTOs
export interface GenreDTO {
  genreId: number;
  genreName: string;
}

export interface CreateMovieActorDTO {
  actorId: number;
  characterName: string;
}

export interface MovieActorInDetailMovieDTO {
  actorId: number;
  actorName: string;
  characterName: string;
  avatarURL: string;
}

export interface ReviewInMovieDetailDTO {
  reviewId: number;
  clientName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
