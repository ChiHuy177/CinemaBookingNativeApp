/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {MovieDetailScreenProps} from '../types/screentypes';
import {SafeAreaView} from 'react-native-safe-area-context';
import MovieTrailer from '../components/MovieTrailer';
import {MovieDetailProps} from '../types/movie';
import {useSpinner} from '../context/SpinnerContext';
import {
  checkErrorFetchingData,
  formatMinutesToHours,
  getActorImage,
  getAgeRatingColor,
  getAgeRatingFromRequireAge,
  getClientImage,
  getPosterImage,
  getRelativeTimeFromNow,
  showToast,
} from '../utils/functions';
import {movieDetailForBooking} from '../api/services/movie.service';
import {
  handleAddFavoriteMovie,
  handleRemoveFavoriteMovie,
} from '../utils/movie';
import {useFocusEffect} from '@react-navigation/native';

const {width} = Dimensions.get('window');

const MovieDetailScreen: React.FC<MovieDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const [movie, setMovie] = useState<MovieDetailProps | null>(null);
  const {showSpinner, hideSpinner} = useSpinner();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      async function getMovieDetailForBooking() {
        const {movieId} = route.params;
        try {
          showSpinner();
          const responseData = await movieDetailForBooking(movieId);
          if (responseData.code === 1000 && isActive) {
            setMovie(responseData.result);
          } else {
            showToast({
              type: 'error',
              text1: 'Error getting movie detail',
              text2: responseData.message,
            });
          }
        } catch (error) {
          checkErrorFetchingData({
            error: error,
            title: 'Error getting movie detail',
          });
        } finally {
          hideSpinner();
        }
      }
      getMovieDetailForBooking();

      return () => {
        isActive = false;
      };
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.videoContainer}>
          <MovieTrailer
            trailerURL={movie?.trailerURL || ''}
            key={movie?.trailerURL}
          />
        </View>

        <View style={styles.titleSection}>
          <View style={styles.trailerLabel}>
            <Text style={styles.trailerText}>OFFICIAL TRAILER</Text>
          </View>
          <View style={styles.ageRating}>
            <Text
              style={[
                styles.ageText,
                {color: getAgeRatingColor(movie?.requireAge || 0)},
              ]}>
              {getAgeRatingFromRequireAge(movie?.requireAge || 0)}
            </Text>
          </View>
          <View style={styles.totalLikeContainer}>
            {movie?.isFavorite ? (
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() =>
                  handleRemoveFavoriteMovie(
                    movie.movieId || 0,
                    setMovie,
                    showSpinner,
                    hideSpinner,
                  )
                }>
                <Icon name="heart" size={24} color="#B4263C" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() =>
                  handleAddFavoriteMovie(
                    movie?.movieId || 0,
                    setMovie,
                    showSpinner,
                    hideSpinner,
                  )
                }>
                <Icon name="heart-outline" size={24} color="#B4263C" />
              </TouchableOpacity>
            )}

            <Text style={styles.totalLikeText}> {movie?.totalLike}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={14} color="#FF6B35" />
            <Text style={styles.rating}>{movie?.rating}/5</Text>
          </View>
        </View>

        <View style={styles.titleSection}>
          <Text style={styles.movieTitle}>{movie?.title}</Text>
        </View>

        <View style={styles.movieInfoSection}>
          <View style={styles.movieDetails}>
            <View style={styles.movieMeta}>
              <Text style={styles.duration}>
                {formatMinutesToHours(movie?.duration || 0)}
              </Text>

              {movie?.genres.map(genre => (
                <Text style={styles.genre} key={genre.genreId}>
                  {genre.name}
                </Text>
              ))}
            </View>

            <Text style={styles.director}>DIRECTED BY {movie?.director}</Text>

            <Text
              style={styles.description}
              ellipsizeMode={'tail'}
              numberOfLines={4}>
              {movie?.description}
            </Text>
            <Text style={styles.director}>{movie?.language}</Text>
            <TouchableOpacity
              onPress={() => {
                if (movie) {
                  navigation.navigate('MovieReviewScreen', movie);
                }
              }}>
              <Text style={styles.readMore}>Rate, review, add to list...</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.posterContainer}>
            <Image
              source={{uri: getPosterImage(movie?.posterURL || '')}}
              style={styles.posterImage}
              resizeMode="cover"
            />
          </View>
        </View>

        <View style={styles.castSection}>
          <Text style={styles.sectionTitle}>Cast</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.castScrollView}>
            {movie?.movieActors.map((movieActor, index) => (
              <View key={index} style={styles.castItem}>
                <Image
                  source={{uri: getActorImage(movieActor.actor.imageURL)}}
                  style={styles.castImage}
                />
                <Text style={styles.castName}>{movieActor.actor.name}</Text>
                <Text style={styles.castCharacter}>
                  {movieActor.characterName}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={styles.reviewsSection}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          {movie?.reviews.map((eachReview, index) => (
            <View key={index}>
              <View style={styles.reviewRating}>
                <Icon name="star" size={16} color="#FF6B35" />
                <Text style={styles.reviewScore}>{eachReview.rating}/5</Text>
              </View>
              <View style={styles.reviewItem}>
                <Image
                  source={{uri: getClientImage(eachReview.client.avatar)}}
                  style={styles.reviewerImage}
                />
                <View style={styles.reviewContent}>
                  <Text
                    style={styles.reviewText}
                    ellipsizeMode="tail"
                    numberOfLines={4}>
                    {eachReview.comment}
                  </Text>
                </View>
              </View>
              <Text style={styles.reviewDate}>
                {getRelativeTimeFromNow(eachReview.createdAt)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() =>
            navigation.navigate('ShowingTimeBookingScreen', {
              movieId: movie?.movieId || 0,
              movieTitle: movie?.title || '',
              poster: movie?.posterURL || '',
            })
          }>
          <Text style={styles.bookButtonText}>Book Tickets</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#1a1a1a',
    marginBottom: 5,
  },
  backButton: {
    padding: 5,
  },
  favoriteButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  videoContainer: {
    width: width - 40,
    height: 200,
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 10,
  },
  videoImage: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -20}, {translateY: -20}],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleSection: {
    paddingHorizontal: 20,
    marginBottom: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  trailerLabel: {
    alignSelf: 'flex-start',
    backgroundColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  trailerText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  movieInfoSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  posterContainer: {
    marginLeft: 10,
  },
  posterImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
  },
  movieDetails: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  movieTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  movieMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
    gap: 5,
  },
  duration: {
    color: '#999',
    fontSize: 13,
  },
  separator: {
    color: '#999',
    fontSize: 13,
    marginHorizontal: 8,
  },
  genre: {
    color: '#999',
    fontSize: 13,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  rating: {
    color: '#FF6B35',
    fontSize: 13,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  director: {
    color: '#999',
    fontSize: 11,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  tagline: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    color: '#ccc',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  readMore: {
    color: '#FF6B35',
    fontSize: 13,
  },
  castSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  castScrollView: {
    marginLeft: -20,
    paddingLeft: 20,
  },
  castItem: {
    marginRight: 15,
    alignItems: 'center',
    width: 85,
  },
  castImage: {
    width: 60,
    height: 60,
    borderRadius: 25,
    marginBottom: 6,
    backgroundColor: '#333',
  },
  castName: {
    color: '#fff',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 2,
    fontWeight: '500',
  },
  castCharacter: {
    color: '#999',
    fontSize: 9,
    textAlign: 'center',
  },
  reviewsSection: {
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  reviewScore: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  reviewerImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    backgroundColor: '#333',
  },
  reviewContent: {
    flex: 1,
  },
  reviewText: {
    color: '#ccc',
    fontSize: 13,
    lineHeight: 18,
  },
  reviewDate: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    textAlign: 'right',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  bookButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  totalLikeContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 1,
    alignItems: 'center',
  },
  totalLikeText: {
    color: '#ccc',
  },
});

export default MovieDetailScreen;
