/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Pressable,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MovieMainHomeProps} from '../types/movie';
import {useSpinner} from '../context/SpinnerContext';

import {HomeScreenProps} from '../types/screentypes';
import Icon from 'react-native-vector-icons/Ionicons';

import {useFocusEffect} from '@react-navigation/native';
import {
  showToast,
  checkErrorFetchingData,
  getPosterImage,
} from '../utils/function';
import {movieMainHome} from '../services/MovieService';

const {width} = Dimensions.get('window');

// THEME CONSTANTS
const THEME = {
  background: '#10111D',
  cardBg: '#1F2130',
  accent: '#F74346',
  textWhite: '#FFFFFF',
  textGray: '#8F90A6',
  textPlaceholder: '#5C5E6F',
  error: '#F74346',
};

export const HomeScreen: React.FC<HomeScreenProps> = ({navigation}) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [topShows, setTopShows] = useState<MovieMainHomeProps[]>([]);
  const [nowShowing, setNowShowing] = useState<MovieMainHomeProps[]>([]);
  const [comingSoon, setComingSoon] = useState<MovieMainHomeProps[]>([]);
  const {showSpinner, hideSpinner} = useSpinner();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchMovies = async () => {
        try {
          showSpinner();
          const responseData = await movieMainHome();
          if (responseData.code === 1000 && isActive) {
            setTopShows(responseData.result.slice(0, 3));

            const excluTopShows = responseData.result.slice(3);
            const nowShowingMovies = excluTopShows.filter(
              movie => new Date(movie.releaseDate) <= new Date(),
            );
            const comingSoonMovies = excluTopShows.filter(
              movie => new Date(movie.releaseDate) > new Date(),
            );

            setNowShowing(nowShowingMovies);
            setComingSoon(comingSoonMovies);
          } else {
            showToast({
              type: 'error',
              text1: 'Error',
              text2: responseData.message || 'Unable to load movies',
            });
          }
        } catch (error) {
          checkErrorFetchingData({
            error: error,
            title: 'Error fetching home movies',
          });
        } finally {
          hideSpinner();
        }
      };
      fetchMovies();
      return () => {
        isActive = false;
      };
    }, []),
  );

  const renderTopShow = useCallback(
    (item: MovieMainHomeProps) => (
      <Pressable
        key={item.movieId}
        onPress={() =>
          navigation.navigate('MovieDetailScreen', {
            movieId: item.movieId,
          })
        }
        style={{width: width, paddingHorizontal: 20}}>
        <View style={styles.featuredCard}>
          <Image
            source={{uri: getPosterImage(item.posterURL)}}
            style={styles.featuredImage}
            onError={() => console.error('Error loading image for Top Show:', item.posterURL)}
          />
          <View style={styles.featuredGradient}>
            <View style={styles.featuredContent}>
              <View style={styles.featuredBadge}>
                <Text style={styles.featuredBadgeText}>FEATURED</Text>
              </View>
              <Text style={styles.featuredTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <TouchableOpacity style={styles.bookNowButton}>
                <Text style={styles.bookNowText}>BOOK NOW</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Pressable>
    ),
    [navigation],
  );

  const renderMovieCard = useCallback(
    (item: MovieMainHomeProps, index: number) => {
      const isEven = index % 2 === 0;
      return (
        <TouchableOpacity
          key={item.movieId}
          style={[
            styles.gridMovieCard,
            isEven ? styles.gridMovieCardLeft : styles.gridMovieCardRight,
          ]}
          onPress={() =>
            navigation.navigate('MovieDetailScreen', {
              movieId: item.movieId,
            })
          }>
          <View style={styles.gridImageContainer}>
            <Image
              source={{uri: getPosterImage(item.posterURL)}}
              style={styles.gridMovieImage}
              onError={() => console.error('Error loading image for Movie Card:', item.posterURL)}
            />
            <View style={styles.gridImageOverlay} />
          </View>
          <View style={styles.gridMovieInfo}>
            <Text style={styles.gridMovieTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <TouchableOpacity style={styles.playButton}>
              <View style={styles.playIconCircle}>
                <View style={styles.playIconTriangle} />
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    },
    [navigation],
  );

  const renderNowShowing = useMemo(() => {
    return nowShowing.map((item, index) => renderMovieCard(item, index));
  }, [nowShowing, renderMovieCard]);

  const renderComingSoon = useMemo(() => {
    return comingSoon.map((item, index) => renderMovieCard(item, index));
  }, [comingSoon, renderMovieCard]);

  const renderDots = useCallback(
    () => (
      <View style={styles.dotsContainer}>
        {topShows.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === activeSlide ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    ),
    [activeSlide, topShows],
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={BG_DARK} barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Discover</Text>
          <View style={styles.headerActions}>
            <Pressable
              style={styles.headerIconButton}
              onPress={() => navigation.navigate('MyTicketsScreen')}>
              <Icon name="ticket-outline" size={24} color="#FFFFFF" />
            </Pressable>
            <Pressable
              style={[styles.headerIconButton, styles.searchButton]}
              onPress={() => navigation.navigate('SearchScreen')}>
              <Icon name="search-outline" size={24} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Featured Section */}
          <View style={styles.featuredSection}>
            {topShows.length > 0 ? (
              <>
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  decelerationRate="fast"
                  snapToInterval={width}
                  onMomentumScrollEnd={event => {
                    const slideIndex = Math.round(
                      event.nativeEvent.contentOffset.x / width,
                    );
                    setActiveSlide(slideIndex);
                  }}>
                  {topShows.map(item => renderTopShow(item))}
                </ScrollView>
                {renderDots()}
              </>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Loading featured movies...</Text>
              </View>
            )}
          </View>

          {/* Now Showing Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Now Showing</Text>
                <Text style={styles.sectionSubtitle}>
                  {nowShowing.length} movies available
                </Text>
              </View>
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            {nowShowing.length > 0 ? (
              <View style={styles.gridContainer}>{renderNowShowing}</View>
            ) : (
              <Text style={styles.emptySectionText}>
                No movies now showing.
              </Text>
            )}
          </View>

          {/* Coming Soon Section */}
          {comingSoon.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View>
                  <Text style={styles.sectionTitle}>Coming Soon</Text>
                  <Text style={styles.sectionSubtitle}>
                    {comingSoon.length} upcoming releases
                  </Text>
                </View>
                <TouchableOpacity onPress={() => {}}>
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.gridContainer}>{renderComingSoon}</View>
            </View>
          )}

          <View style={{height: 100}} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

// COLORS
const ACCENT_RED = '#F74346';
const BG_DARK = '#0F101A';
const CARD_DARK = '#1C1825';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_DARK,
  },
  safeArea: {
    flex: 1,
    backgroundColor: BG_DARK,
  },
  content: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: CARD_DARK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButton: {
    backgroundColor: ACCENT_RED,
  },

  // Featured Section
  featuredSection: {
    marginBottom: 32,
  },
  featuredCard: {
    height: 480,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: CARD_DARK,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'linear-gradient(to top, rgba(15,16,26,0.95), transparent)',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  featuredContent: {
    gap: 12,
  },
  featuredBadge: {
    alignSelf: 'flex-start',
    backgroundColor: ACCENT_RED,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  featuredBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  featuredTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  bookNowButton: {
    backgroundColor: ACCENT_RED,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  bookNowText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Dots
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 8,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 24,
    backgroundColor: ACCENT_RED,
  },
  dotInactive: {
    width: 6,
    backgroundColor: '#3F3B4E',
  },

  // Sections
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: THEME.textGray,
    fontSize: 13,
    fontWeight: '500',
  },
  seeAllText: {
    color: ACCENT_RED,
    fontSize: 15,
    fontWeight: '600',
  },

  // Grid Layout
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
  },
  gridMovieCard: {
    width: (width - 52) / 2,
    marginBottom: 20,
    backgroundColor: CARD_DARK,
    borderRadius: 20,
    overflow: 'hidden',
  },
  gridMovieCardLeft: {
    marginRight: 12,
  },
  gridMovieCardRight: {
    marginLeft: 0,
  },
  gridImageContainer: {
    width: '100%',
    height: 240,
    position: 'relative',
  },
  gridMovieImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gridImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  gridMovieInfo: {
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridMovieTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
    lineHeight: 20,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ACCENT_RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIconCircle: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIconTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 0,
    borderBottomWidth: 5,
    borderTopWidth: 5,
    borderLeftColor: '#FFFFFF',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    marginLeft: 2,
  },

  // Empty States
  emptyState: {
    height: 480,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: CARD_DARK,
    marginHorizontal: 20,
    borderRadius: 24,
  },
  emptyText: {
    color: THEME.textGray,
    fontSize: 16,
  },
  emptySectionText: {
    color: THEME.textGray,
    fontSize: 14,
    marginLeft: 20,
    fontStyle: 'italic',
  },
});