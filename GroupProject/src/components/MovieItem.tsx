import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {MovieListProps} from '../types/movie';

import {Icon} from 'react-native-paper';
import {useState} from 'react';
import {
  handleAddFavoriteMovie,
  handleRemoveFavoriteMovie,
} from '../utils/movie';
import { formatDate } from 'date-fns';
import { getPosterImage, getAgeRatingColor, getAgeRatingFromRequireAge, formatMinutesToHours } from '../utils/function';

export default function MovieItem({
  movie,
  navigate,
  showSpinner,
  hideSpinner,
}: {
  movie: MovieListProps;
  navigate: () => void;
  showSpinner: () => void;
  hideSpinner: () => void;
}) {
  const [movieItem, setMovieItem] = useState<MovieListProps | null>(movie);

  return (
    <TouchableOpacity
      key={movieItem?.movieId}
      style={styles.movieItem}
      onPress={() => navigate()}>
      <Image
        source={{uri: getPosterImage(movieItem?.posterURL || '')}}
        style={styles.movieImage}
      />
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {movieItem?.title}
        </Text>
        <View style={styles.movieDetails}>
          <Text style={styles.movieDate}>
            {formatDate(movieItem?.releaseDate || new Date())}
          </Text>
          <View style={styles.ageRating}>
            <Text
              style={[
                styles.ageText,
                {color: getAgeRatingColor(movieItem?.requireAge || 0)},
              ]}>
              {getAgeRatingFromRequireAge(movieItem?.requireAge || 0)}
            </Text>
          </View>
          <Text style={styles.movieDuration}>
            {formatMinutesToHours(movieItem?.duration || 0)}
          </Text>
        </View>
        <View style={styles.movieGenreContainer}>
          {movieItem?.genres.map(eachGenre => (
            <Text style={styles.movieGenre} key={eachGenre}>
              {eachGenre}
            </Text>
          ))}
        </View>
        <View style={styles.ratingAndTotalLikeContainer}>
          <View style={styles.ratingContainer}>
            <Icon source="star" size={14} color="#FF6B35" />
            <Text style={styles.rating}>{movieItem?.rating}/5</Text>
          </View>
          <View style={styles.totalLikeContainer}>
            {movieItem?.isFavorite ? (
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() =>
                  handleRemoveFavoriteMovie(
                    movie.movieId,
                    setMovieItem,
                    showSpinner,
                    hideSpinner,
                  )
                }>
                <Icon source="heart" size={24} color="#B4263C" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() =>
                  handleAddFavoriteMovie(
                    movie?.movieId,
                    setMovieItem,
                    showSpinner,
                    hideSpinner,
                  )
                }>
                <Icon source="heart-outline" size={24} color="#B4263C" />
              </TouchableOpacity>
            )}

            <Text style={styles.totalLikeText}> {movieItem?.totalLike}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  movieItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'flex-start',
  },
  movieImage: {
    width: 100,
    height: 150,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
  },
  movieInfo: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    lineHeight: 22,
    marginBottom: 6,
  },
  movieDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    display: 'flex',
    gap: 10,
  },
  movieDate: {
    fontSize: 14,
    color: '#C5C5C5',
  },
  ageRating: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ageText: {
    fontSize: 12,
    fontWeight: '600',
  },
  movieDuration: {
    fontSize: 14,
    color: '#C5C5C5',
  },
  movieGenreContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    flexWrap: 'wrap',
  },
  movieGenre: {
    fontSize: 14,
    color: '#C5C5C5',
  },
  ratingContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingAndTotalLikeContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rating: {
    color: '#FF6B35',
    fontSize: 13,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  formatsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chevronButton: {
    padding: 8,
    justifyContent: 'center',
  },
  chevronText: {
    fontSize: 20,
    color: '#C5C5C5',
  },
  totalLikeContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 1,
    alignItems: 'center',
  },
  favoriteButton: {
    padding: 5,
  },
  totalLikeText: {
    color: '#ccc',
  },
});
