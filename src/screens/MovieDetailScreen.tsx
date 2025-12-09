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
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';

// Types & Services
import {MovieDetailScreenProps} from '../types/screentypes';
import {MovieDetailProps} from '../types/movie';
import {useSpinner} from '../context/SpinnerContext';
import {movieDetailForBooking} from '../services/MovieService';
import MovieTrailer from '../components/MovieTrailer';

// Utils
import {
  handleAddFavoriteMovie,
  handleRemoveFavoriteMovie,
} from '../utils/movie';
import {
  showToast,
  checkErrorFetchingData,
  getAgeRatingColor,
  getAgeRatingFromRequireAge,
  formatMinutesToHours,
  getPosterImage,
  getActorImage,
  getClientImage,
  getRelativeTimeFromNow,
} from '../utils/function';

// const {width} = Dimensions.get('window');

// --- CINEMATIC DARK THEME CONFIGURATION ---
const THEME = {
  background: '#10111D', // Deep Cinematic Blue/Black
  cardBg: '#1C1D2E', // Slightly lighter panel
  primaryRed: '#F74346', // Neon/Cinematic Red
  textWhite: '#FFFFFF',
  textGray: '#A0A0B0',
  textDarkGray: '#5C5D6F',
  glass: 'rgba(255, 255, 255, 0.08)', // Glassmorphism effect
  shadowColor: '#F74346', // Glow color
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
              text1: 'Data Error',
              text2: responseData.message || 'Could not load movie details.',
            });
          }
        } catch (error) {
          checkErrorFetchingData({
            error: error,
            title: 'Connection Error',
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.background} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* HERO SECTION WITH POSTER AND OVERLAY */}
        <View style={styles.heroSection}>
          <Image
            source={{uri: getPosterImage(movie?.posterURL || '')}}
            style={styles.heroPosterImage}
            resizeMode="cover"
            blurRadius={10}
          />
          <View style={styles.heroOverlay} />
          
          {/* Back Button - Floating on top */}
          <SafeAreaView style={styles.headerSafe}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <Icon name="chevron-back" size={24} color="#FFF" />
            </TouchableOpacity>
          </SafeAreaView>

          {/* Main Poster Card */}
          <View style={styles.posterCardContainer}>
            <View style={styles.posterCard}>
              <Image
                source={{uri: getPosterImage(movie?.posterURL || '')}}
                style={styles.mainPosterImage}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        {/* MOVIE INFO SECTION */}
        <View style={styles.infoSection}>
          {/* Title and Like */}
          <View style={styles.titleContainer}>
            <View style={{flex: 1}}>
              <Text style={styles.movieTitle}>{movie?.title}</Text>
              <View style={styles.metaRow}>
                <View style={[styles.ageTag, {borderColor: getAgeRatingColor(movie?.requireAge || 0)}]}>
                  <Text style={[styles.ageText, {color: getAgeRatingColor(movie?.requireAge || 0)}]}>
                    {getAgeRatingFromRequireAge(movie?.requireAge || 0)}
                  </Text>
                </View>
                <Text style={styles.metaSeparator}>•</Text>
                <Text style={styles.metaText}>{movie?.language || 'EN'}</Text>
                <Text style={styles.metaSeparator}>•</Text>
                <Text style={styles.metaText}>
                  {formatMinutesToHours(movie?.duration || 0)}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.likeButton}
              onPress={() =>
                movie?.isFavorite
                  ? handleRemoveFavoriteMovie(
                      movie.movieId || 0,
                      setMovie,
                      showSpinner,
                      hideSpinner,
                    )
                  : handleAddFavoriteMovie(
                      movie?.movieId || 0,
                      setMovie,
                      showSpinner,
                      hideSpinner,
                    )
              }>
              <Icon
                name={movie?.isFavorite ? 'heart' : 'heart-outline'}
                size={28}
                color={THEME.primaryRed}
              />
              <Text style={styles.likeCount}>{movie?.totalLike}</Text>
            </TouchableOpacity>
          </View>

          {/* Rating and Genres */}
          <View style={styles.ratingGenresContainer}>
            <View style={styles.ratingCard}>
              <Icon name="star" size={20} color="#FFD700" />
              <View style={{marginLeft: 8}}>
                <Text style={styles.ratingNumber}>{movie?.rating}</Text>
                <Text style={styles.ratingLabel}>Rating</Text>
              </View>
            </View>
            <View style={styles.genresContainer}>
              {movie?.genres.slice(0, 3).map(genre => (
                <View key={genre.genreId} style={styles.genreChip}>
                  <Text style={styles.genreChipText}>{genre.name}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Trailer Section */}
          <View style={styles.trailerSection}>
            <Text style={styles.sectionTitle}>Watch Trailer</Text>
            <View style={styles.trailerContainer}>
              <MovieTrailer
                trailerURL={movie?.trailerURL || ''}
                key={movie?.trailerURL}
              />
            </View>
          </View>

          {/* Storyline */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Storyline</Text>
            <Text style={styles.descriptionText} numberOfLines={4}>
              {movie?.description}
            </Text>
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => movie && navigation.navigate('MovieReviewScreen', movie)}>
              <Text style={styles.readMoreText}>Read more & Rate</Text>
            </TouchableOpacity>
          </View>

          {/* Director */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Director</Text>
            <Text style={styles.directorName}>{movie?.director}</Text>
          </View>

          {/* Cast */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cast</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.castList}>
              {movie?.movieActors.map((movieActor, index) => (
                <View key={index} style={styles.castCard}>
                  <View style={styles.castImageWrapper}>
                    <Image
                      source={{uri: getActorImage(movieActor.actor.imageURL)}}
                      style={styles.castImage}
                    />
                  </View>
                  <Text style={styles.castName} numberOfLines={1}>
                    {movieActor.actor.name}
                  </Text>
                  <Text style={styles.castRole} numberOfLines={1}>
                    {movieActor.characterName}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Reviews */}
          <View style={[styles.section, {marginBottom: 120}]}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Reviews</Text>
              <View style={styles.reviewCount}>
                <Icon name="chatbubble-ellipses" size={16} color={THEME.textGray} />
                <Text style={styles.reviewCountText}>{movie?.reviews.length || 0}</Text>
              </View>
            </View>
            
            {movie?.reviews.map((eachReview, index) => (
              <View key={index} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Image
                    source={{uri: getClientImage(eachReview.client.avatar)}}
                    style={styles.reviewAvatar}
                  />
                  <View style={{flex: 1}}>
                    <Text style={styles.reviewerName}>{eachReview.client.name || 'User'}</Text>
                    <Text style={styles.reviewDate}>
                      {getRelativeTimeFromNow(eachReview.createdAt)}
                    </Text>
                  </View>
                  <View style={styles.reviewRating}>
                    <Icon name="star" size={12} color="#FFD700" />
                    <Text style={styles.reviewRatingText}>{eachReview.rating}</Text>
                  </View>
                </View>
                <Text style={styles.reviewComment} numberOfLines={3}>
                  {eachReview.comment}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM BOOKING BAR */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bookButton}
          activeOpacity={0.9}
          onPress={() =>
            navigation.navigate('ShowingTimeBookingScreen', {
              movieId: movie?.movieId || 0,
              movieTitle: movie?.title || '',
              poster: movie?.posterURL || '',
            })
          }>
          <Text style={styles.bookButtonText}>Book Tickets</Text>
          <Icon name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Hero Section
  heroSection: {
    height: 420,
    position: 'relative',
  },
  heroPosterImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(16, 17, 29, 0.7)',
  },
  headerSafe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  posterCardContainer: {
    position: 'absolute',
    bottom: -60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 5,
  },
  posterCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  mainPosterImage: {
    width: 200,
    height: 300,
    borderRadius: 24,
  },

  // Info Section
  infoSection: {
    marginTop: 80,
    paddingHorizontal: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  movieTitle: {
    color: THEME.textWhite,
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 32,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  ageTag: {
    borderWidth: 1.5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ageText: {
    fontSize: 11,
    fontWeight: '700',
  },
  metaSeparator: {
    color: THEME.textDarkGray,
    marginHorizontal: 8,
    fontSize: 12,
  },
  metaText: {
    color: THEME.textGray,
    fontSize: 13,
    fontWeight: '500',
  },
  likeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 12,
  },
  likeCount: {
    color: THEME.textWhite,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },

  // Rating and Genres
  ratingGenresContainer: {
    flexDirection: 'row',
    marginBottom: 28,
    gap: 12,
  },
  ratingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.cardBg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  ratingNumber: {
    color: THEME.textWhite,
    fontSize: 16,
    fontWeight: '700',
  },
  ratingLabel: {
    color: THEME.textGray,
    fontSize: 11,
  },
  genresContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreChip: {
    backgroundColor: THEME.cardBg,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  genreChipText: {
    color: THEME.textGray,
    fontSize: 12,
    fontWeight: '500',
  },

  // Sections
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    color: THEME.textWhite,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },

  // Trailer
  trailerSection: {
    marginBottom: 28,
  },
  trailerContainer: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
  },

  // Storyline
  descriptionText: {
    color: THEME.textGray,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },
  readMoreText: {
    color: THEME.primaryRed,
    fontSize: 14,
    fontWeight: '600',
  },

  // Director
  directorName: {
    color: THEME.textWhite,
    fontSize: 16,
    fontWeight: '500',
  },

  // Cast
  castList: {
    paddingRight: 20,
    gap: 16,
  },
  castCard: {
    alignItems: 'center',
    width: 90,
  },
  castImageWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: THEME.cardBg,
  },
  castImage: {
    width: '100%',
    height: '100%',
  },
  castName: {
    color: THEME.textWhite,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  castRole: {
    color: THEME.textDarkGray,
    fontSize: 11,
    textAlign: 'center',
  },

  // Reviews
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  reviewCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.cardBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  reviewCountText: {
    color: THEME.textGray,
    fontSize: 13,
    fontWeight: '600',
  },
  reviewCard: {
    backgroundColor: THEME.cardBg,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.03)',
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: THEME.textDarkGray,
  },
  reviewerName: {
    color: THEME.textWhite,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  reviewDate: {
    color: THEME.textDarkGray,
    fontSize: 12,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  reviewRatingText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '700',
  },
  reviewComment: {
    color: THEME.textGray,
    fontSize: 14,
    lineHeight: 20,
  },

  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    backgroundColor: THEME.background,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  bookButton: {
    backgroundColor: THEME.primaryRed,
    height: 56,
    borderRadius: 28,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: THEME.primaryRed,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default MovieDetailScreen;