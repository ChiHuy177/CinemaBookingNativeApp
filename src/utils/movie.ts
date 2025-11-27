import { addFavoriteMovie, removeFavoriteMovie } from '../services/MovieService';
import { FavoriteMovieBaseProps } from '../types/movie';
import { checkErrorFetchingData } from './function';

export const handleAddFavoriteMovie = async <T extends FavoriteMovieBaseProps>(
  id: number,
  setAddFavoriteMovie: React.Dispatch<React.SetStateAction<T | null>>,
  showSpinner: () => void,
  hideSpinner: () => void,
) => {
  try {
    showSpinner();
    const responseData = await addFavoriteMovie(id);
    if (responseData.code === 1000) {
      setAddFavoriteMovie(prev => {
        if (!prev) {
          return null;
        }
        return {
          ...prev,
          isFavorite: true,
          totalLike: responseData.result,
        };
      });
    }
  } catch (error) {
    checkErrorFetchingData({
      error: error,
      title: 'Error add favorite movie',
    });
  } finally {
    hideSpinner();
  }
};

export const handleRemoveFavoriteMovie = async <
  T extends FavoriteMovieBaseProps,
>(
  id: number,
  setRemoveFavoriteMovie: React.Dispatch<React.SetStateAction<T | null>>,
  showSpinner: () => void,
  hideSpinner: () => void,
) => {
  try {
    showSpinner();
    const responseData = await removeFavoriteMovie(id);
    if (responseData.code === 1000) {
      setRemoveFavoriteMovie(prev => {
        if (!prev) {
          return null;
        }
        return {
          ...prev,
          isFavorite: false,
          totalLike: responseData.result,
        };
      });
    }
  } catch (error) {
    checkErrorFetchingData({
      error: error,
      title: 'Error add favorite movie',
    });
  } finally {
    hideSpinner();
  }
};
