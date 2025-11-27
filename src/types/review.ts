import {ClientInReviewProps} from './client';

export interface ReviewInMovieDetailProps {
  comment: string;
  rating: number;
  createdAt: Date;
  client: ClientInReviewProps;
}

export interface ReviewAddProps {
  movieId: number;
  comment: string;
  rating: number;
}
