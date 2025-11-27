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

const {width} = Dimensions.get('window');

// --- CINEMATIC DARK THEME CONFIGURATION ---
const THEME = {
  background: '#10111D', // Deep Cinematic Blue/Black
  cardBg: '#1C1D2E', // Slightly lighter panel
  primaryRed: '#FF3B30', // Neon/Cinematic Red
  textWhite: '#FFFFFF',
  textGray: '#A0A0B0',
  textDarkGray: '#5C5D6F',
  glass: 'rgba(255, 255, 255, 0.08)', // Glassmorphism effect
  shadowColor: '#FF3B30', // Glow color
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.background} />

      {/* Header with Glass Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.glassButton}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          Movie Details
        </Text>
        <View style={{width: 40}} /> 
        {/* Spacer to center title properly */}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* VIDEO SECTION */}
        <View style={styles.videoWrapper}>
          <View style={styles.videoContainer}>
            <MovieTrailer
              trailerURL={movie?.trailerURL || ''}
              key={movie?.trailerURL}
            />
          </View>
          {/* Glow Effect behind video */}
          <View style={styles.videoGlow} />
        </View>

        {/* MAIN INFO HEADER */}
        <View style={styles.mainInfoContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.movieTitle}>{movie?.title}</Text>
          </View>

          {/* Meta Data Row: Time | Language | Rating */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Icon name="time-outline" size={14} color={THEME.primaryRed} />
              <Text style={styles.metaText}>
                {formatMinutesToHours(movie?.duration || 0)}
              </Text>
            </View>
            <View style={styles.divider} />
            <Text style={styles.metaText}>{movie?.language || 'EN'}</Text>
            <View style={styles.divider} />
            <View style={styles.ratingBadge}>
              <Icon name="star" size={12} color="#FFD700" />
              <Text style={styles.ratingText}>{movie?.rating}</Text>
            </View>
          </View>

          {/* Action Row: Trailer Tag | Age | Like */}
          <View style={styles.actionRow}>
            <View style={styles.tagContainer}>
               <View style={[styles.ageTag, {borderColor: getAgeRatingColor(movie?.requireAge || 0)}]}>
                <Text style={[styles.ageText, {color: getAgeRatingColor(movie?.requireAge || 0)}]}>
                  {getAgeRatingFromRequireAge(movie?.requireAge || 0)}
                </Text>
              </View>
            </View>

            {/* Like Button Group */}
            <View style={styles.likeContainer}>
              <TouchableOpacity
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
                  size={26}
                  color={THEME.primaryRed}
                />
              </TouchableOpacity>
              <Text style={styles.likeCount}>{movie?.totalLike}</Text>
            </View>
          </View>
        </View>

        <View style={styles.separator} />

        {/* CONTENT & POSTER SECTION */}
        <View style={styles.contentSection}>
          <View style={styles.posterWrapper}>
            <Image
              source={{uri: getPosterImage(movie?.posterURL || '')}}
              style={styles.posterImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.detailsWrapper}>
            <Text style={styles.sectionLabel}>GENRES</Text>
            <View style={styles.genreRow}>
              {movie?.genres.map(genre => (
                <View key={genre.genreId} style={styles.genrePill}>
                  <Text style={styles.genreText}>{genre.name}</Text>
                </View>
              ))}
            </View>

            <Text style={[styles.sectionLabel, {marginTop: 15}]}>DIRECTOR</Text>
            <Text style={styles.directorName}>{movie?.director}</Text>

            <Text style={[styles.sectionLabel, {marginTop: 15}]}>STORYLINE</Text>
            <Text
              style={styles.descriptionText}
              ellipsizeMode="tail"
              numberOfLines={4}>
              {movie?.description}
            </Text>
            
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => movie && navigation.navigate('MovieReviewScreen', movie)}>
              <Text style={styles.readMoreText}>Read more & Rate...</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CAST SECTION */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Cast & Crew</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.castList}>
            {movie?.movieActors.map((movieActor, index) => (
              <View key={index} style={styles.castCard}>
                <Image
                  source={{uri: getActorImage(movieActor.actor.imageURL)}}
                  style={styles.castImg}
                />
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

        {/* REVIEWS SECTION */}
        <View style={[styles.sectionContainer, {marginBottom: 100}]}>
          <View style={styles.reviewHeaderRow}>
             <Text style={styles.sectionHeader}>Reviews</Text>
             <Icon name="chatbubble-ellipses-outline" size={20} color={THEME.textDarkGray} />
          </View>
         
          {movie?.reviews.map((eachReview, index) => (
            <View key={index} style={styles.reviewCard}>
              <View style={styles.reviewTop}>
                <Image
                  source={{uri: getClientImage(eachReview.client.avatar)}}
                  style={styles.reviewerAvatar}
                />
                <View style={{flex: 1}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Text style={styles.reviewerName}>{eachReview.client.name || 'User'}</Text>
                        <View style={styles.reviewRatingBadge}>
                            <Icon name="star" size={10} color="#FFD700" />
                            <Text style={styles.reviewRatingText}>{eachReview.rating}</Text>
                        </View>
                    </View>
                    <Text style={styles.reviewDate}>
                        {getRelativeTimeFromNow(eachReview.createdAt)}
                    </Text>
                </View>
              </View>
              <Text
                style={styles.reviewComment}
                numberOfLines={3}
                ellipsizeMode="tail">
                "{eachReview.comment}"
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* BOTTOM FLOATING BUTTON */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bookingButton}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('ShowingTimeBookingScreen', {
              movieId: movie?.movieId || 0,
              movieTitle: movie?.title || '',
              poster: movie?.posterURL || '',
            })
          }>
          <Text style={styles.bookingBtnText}>Book Ticket</Text>
          <View style={styles.btnGlow} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginBottom: 5,
  },
  headerTitle: {
      color: THEME.textWhite,
      fontSize: 16,
      fontWeight: '600',
      opacity: 0.8,
  },
  glassButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.glass, // Glass effect
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  
  // Video
  videoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    marginTop: 5,
  },
  videoContainer: {
    width: width - 40,
    height: 210,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#000',
    zIndex: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  videoGlow: {
    position: 'absolute',
    width: width - 60,
    height: 180,
    backgroundColor: THEME.primaryRed,
    opacity: 0.15,
    borderRadius: 40,
    bottom: -10,
    zIndex: 1,
    transform: [{scale: 1.05}],
  },

  // Main Info
  mainInfoContainer: {
    paddingHorizontal: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  movieTitle: {
    color: THEME.textWhite,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(255, 59, 48, 0.3)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 10,
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: THEME.textGray,
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 4,
  },
  divider: {
    height: 12,
    width: 1,
    backgroundColor: THEME.textDarkGray,
    marginHorizontal: 12,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 4,
  },

  // Actions
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tagContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  trailerTag: {
    backgroundColor: THEME.primaryRed,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  trailerTagText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  ageTag: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  ageText: {
    fontSize: 11,
    fontWeight: '700',
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.glass,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  likeCount: {
    color: THEME.textWhite,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },

  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginHorizontal: 24,
    marginBottom: 24,
  },

  // Content
  contentSection: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 30,
  },
  posterWrapper: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  posterImage: {
    width: 110,
    height: 165,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  detailsWrapper: {
    flex: 1,
    marginLeft: 20,
  },
  sectionLabel: {
    color: THEME.textDarkGray,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 6,
  },
  directorName: {
    color: THEME.textWhite,
    fontSize: 15,
    fontWeight: '500',
  },
  genreRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  genrePill: {
    backgroundColor: THEME.cardBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  genreText: {
    color: THEME.textGray,
    fontSize: 11,
  },
  descriptionText: {
    color: THEME.textGray,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 8,
  },
  readMoreText: {
    color: THEME.primaryRed,
    fontSize: 13,
    fontWeight: '600',
  },

  // Cast
  sectionContainer: {
    marginBottom: 30,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    color: THEME.textWhite,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  castList: {
    paddingRight: 20,
  },
  castCard: {
    marginRight: 16,
    width: 80,
    alignItems: 'center',
  },
  castImg: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: THEME.cardBg,
    marginBottom: 8,
  },
  castName: {
    color: THEME.textWhite,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  castRole: {
    color: THEME.textDarkGray,
    fontSize: 10,
    textAlign: 'center',
  },

  // Reviews
  reviewHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
  },
  reviewCard: {
    backgroundColor: THEME.cardBg,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  reviewTop: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  reviewerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    backgroundColor: '#333',
  },
  reviewerName: {
      color: THEME.textWhite,
      fontSize: 14,
      fontWeight: '600',
  },
  reviewDate: {
      color: THEME.textDarkGray,
      fontSize: 11,
      marginTop: 2,
  },
  reviewRatingBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.05)',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
  },
  reviewRatingText: {
      color: THEME.textWhite,
      fontSize: 11,
      fontWeight: 'bold',
      marginLeft: 3,
  },
  reviewComment: {
    color: THEME.textGray,
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 18,
  },

  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    backgroundColor: THEME.background, 
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  bookingButton: {
    backgroundColor: THEME.primaryRed,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: THEME.primaryRed,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    position: 'relative',
  },
  bookingBtnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  btnGlow: {
      position: 'absolute',
      top: 5,
      left: 10,
      right: 10,
      height: 20,
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 20,
      opacity: 0.3,
  }
});

export default MovieDetailScreen;