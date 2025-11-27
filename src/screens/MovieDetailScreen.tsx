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
  handleAddFavoriteMovie,
  handleRemoveFavoriteMovie,
} from '../utils/movie';
import {useFocusEffect} from '@react-navigation/native';
import { movieDetailForBooking } from '../services/MovieService';
import { showToast, checkErrorFetchingData, getAgeRatingColor, getAgeRatingFromRequireAge, formatMinutesToHours, getPosterImage, getActorImage, getClientImage, getRelativeTimeFromNow } from '../utils/function';

const {width} = Dimensions.get('window');

// THEME CONSTANTS EXTRACTED FROM IMAGE
const THEME = {
  background: '#13141F', // Dark blue-black background
  primaryRed: '#F54B64', // The coral red color from the "Services" button
  cardBg: '#20212D',     // Slightly lighter for cards
  textWhite: '#FFFFFF',
  textGray: '#8F9BB3',   // Muted blue-gray text
  textDarkGray: '#565E70',
};

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
      {/* Updated StatusBar color */}
      <StatusBar barStyle="light-content" backgroundColor={THEME.background} />

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
                <Icon name="heart" size={24} color={THEME.primaryRed} />
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
                <Icon name="heart-outline" size={24} color={THEME.primaryRed} />
              </TouchableOpacity>
            )}

            <Text style={styles.totalLikeText}> {movie?.totalLike}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={14} color="#FFD700" />
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
                  • {genre.name}
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
                <Text style={styles.castName} numberOfLines={2}>
                   {movieActor.actor.name}
                </Text>
                <Text style={styles.castCharacter} numberOfLines={1}>
                  {movieActor.characterName}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={styles.reviewsSection}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          {movie?.reviews.map((eachReview, index) => (
            <View key={index} style={styles.reviewWrapper}>
              <View style={styles.reviewRating}>
                <Icon name="star" size={16} color="#FFD700" />
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
    backgroundColor: THEME.background, // Theme Color
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: THEME.background, // Theme Color
    marginBottom: 5,
    paddingTop: 10,
  },
  backButton: {
    padding: 5,
    borderRadius: 12,
    backgroundColor: THEME.cardBg, // Slightly lighter background for button
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
    borderRadius: 20, // More rounded as per design
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20,
    backgroundColor: '#000',
  },
  titleSection: {
    paddingHorizontal: 20,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trailerLabel: {
    alignSelf: 'flex-start',
    backgroundColor: THEME.primaryRed, // Use Theme Red
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  trailerText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  movieInfoSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  posterContainer: {
    marginLeft: 15,
  },
  posterImage: {
    width: 120,
    height: 180,
    borderRadius: 16, // Soft rounded corners
  },
  movieDetails: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  movieTitle: {
    color: THEME.textWhite,
    fontSize: 24, // Bigger, bolder title
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  movieMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 5,
  },
  duration: {
    color: THEME.textGray,
    fontSize: 13,
    fontWeight: '600',
    marginRight: 5,
  },
  genre: {
    color: THEME.textGray,
    fontSize: 13,
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  rating: {
    color: THEME.textWhite,
    fontSize: 13,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  director: {
    color: THEME.textDarkGray,
    fontSize: 11,
    marginBottom: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  description: {
    color: THEME.textGray,
    fontSize: 14,
    lineHeight: 22, // Better readability
    marginBottom: 12,
  },
  readMore: {
    color: THEME.primaryRed, // Theme Red
    fontSize: 14,
    fontWeight: '600',
  },
  castSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    color: THEME.textWhite,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
  },
  castScrollView: {
    marginLeft: -20,
    paddingLeft: 20,
  },
  castItem: {
    marginRight: 20,
    alignItems: 'center',
    width: 70,
  },
  castImage: {
    width: 70,
    height: 70,
    borderRadius: 35, // Perfectly circle
    marginBottom: 8,
    backgroundColor: THEME.cardBg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  castName: {
    color: THEME.textWhite,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 2,
    fontWeight: '600',
  },
  castCharacter: {
    color: THEME.textGray,
    fontSize: 10,
    textAlign: 'center',
  },
  reviewsSection: {
    paddingHorizontal: 20,
    marginBottom: 110, // Space for bottom button
  },
  reviewWrapper: {
    backgroundColor: THEME.cardBg, // Card style for reviews
    padding: 15,
    borderRadius: 16,
    marginBottom: 15,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewScore: {
    color: THEME.textWhite,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#333',
  },
  reviewContent: {
    flex: 1,
  },
  reviewText: {
    color: '#D1D5DB',
    fontSize: 13,
    lineHeight: 20,
  },
  reviewDate: {
    fontSize: 11,
    color: THEME.textDarkGray,
    marginTop: 10,
    textAlign: 'right',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(19, 20, 31, 0.95)', // Semi-transparent theme background
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 30, // Safe area padding
    borderTopWidth: 0, // Removed border for cleaner look
  },
  bookButton: {
    backgroundColor: THEME.primaryRed, // Theme Red
    paddingVertical: 18,
    borderRadius: 30, // Pill shape like "Services" button
    alignItems: 'center',
    shadowColor: THEME.primaryRed,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  ageRating: {
    backgroundColor: THEME.cardBg, // Darker bg for tag
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ageText: {
    fontSize: 12,
    fontWeight: '700',
  },
  totalLikeContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 5,
    borderRadius: 20,
    paddingRight: 10,
  },
  totalLikeText: {
    color: THEME.textWhite,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default MovieDetailScreen;