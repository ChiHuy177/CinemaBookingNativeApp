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
import Icon from 'react-native-vector-icons/Ionicons'; // Switched to Ionicons

import {useFocusEffect} from '@react-navigation/native';
import {
  showToast,
  checkErrorFetchingData,
  getPosterImage,
} from '../utils/function';
import {movieMainHome} from '../services/MovieService';

const {width} = Dimensions.get('window');

// THEME CONSTANTS MATCHING PREVIOUS SCREENS
const THEME = {
  background: '#10111D', // Dark cinematic background
  cardBg: '#1F2130',     // Input/Card background
  accent: '#FF3B30',     // Bright Red/Coral accent
  textWhite: '#FFFFFF',
  textGray: '#8F90A6',   // Muted gray
  textPlaceholder: '#5C5E6F',
  error: '#FF3B30',
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
        style={{width: width - 40, marginHorizontal: 20}} // Adjusted width for better card look
      >
        <View style={styles.topShowSlide}>
          <Image
            source={{uri: getPosterImage(item.posterURL)}}
            style={styles.topShowImage}
            onError={() => console.error('Error loading image for Top Show:', item.posterURL)}
          />
          <View style={styles.topShowOverlay}>
            <Text
              style={styles.topShowTitle}
              numberOfLines={2}
              ellipsizeMode="tail">
              {item.title}
            </Text>
            <View style={styles.watchNowBtn}>
                <Text style={styles.watchNowText}>BOOK NOW</Text>
            </View>
          </View>
        </View>
      </Pressable>
    ),
    [navigation],
  );

  const renderMovieCard = useCallback(
    (item: MovieMainHomeProps) => {
      return (
        <TouchableOpacity
          key={item.movieId}
          style={styles.movieCard}
          onPress={() =>
            navigation.navigate('MovieDetailScreen', {
              movieId: item.movieId,
            })
          }>
          <Image
            source={{uri: getPosterImage(item.posterURL)}}
            style={styles.movieImage}
            onError={() => console.error('Error loading image for Movie Card:', item.posterURL)}
          />
          <View style={styles.movieInfoOverlay}>
             <Text style={styles.movieTitleSmall} numberOfLines={1}>{item.title}</Text>
          </View>
        </TouchableOpacity>
      );
    },
    [navigation],
  );

  // Use useMemo only for performance optimization, ensuring dependencies are correct
  const renderNowShowing = useMemo(() => {
    return nowShowing.map(renderMovieCard);
  }, [nowShowing, renderMovieCard]);

  const renderComingSoon = useMemo(() => {
    return comingSoon.map(renderMovieCard);
  }, [comingSoon, renderMovieCard]);

  const renderDots = useCallback(
    () => (
      <View style={styles.dotsContainer}>
        {topShows.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === activeSlide ? ACCENT_RED : MUTED_DOT,
              },
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
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.searchContainer}>
            <Text style={styles.sectionTitle}>Top Shows</Text>
            <View style={styles.iconHeaderContainer}>
              <Pressable
                style={[styles.iconButton, styles.iconButtonDark]}
                onPress={() => navigation.navigate('MyTicketsScreen')}
              >
                <Icon source="ticket-confirmation" size={24} color="#FFFFFF" />
              </Pressable>
              <Pressable
                style={[styles.iconButton, styles.iconButtonPrimary]}
                onPress={() => navigation.navigate('SearchScreen')}
              >
                <Icon source="magnify" size={24} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>

          {/* Top Shows Carousel */}
          <View style={styles.topShowsContainer}>
             <Text style={styles.sectionTitle}>FEATURED</Text>
            {topShows.length > 0 ? (
              <>
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  decelerationRate="fast"
                  snapToInterval={width} // Snap to width
                  contentContainerStyle={{ paddingRight: 0 }} 
                  onMomentumScrollEnd={event => {
                    const slideIndex = Math.round(
                      event.nativeEvent.contentOffset.x / width,
                    );
                    setActiveSlide(slideIndex);
                  }}>
                  {/* Wrapper to align single card in center of screen width if needed, but here sticking to simple paging */}
                  <View style={{flexDirection: 'row'}}> 
                    {topShows.map(item => (
                         <View key={item.movieId} style={{width: width, alignItems: 'center'}}>
                            {renderTopShow(item)}
                         </View>
                    ))}
                  </View>
                </ScrollView>
                {renderDots()}
              </>
            ) : (
              // Empty state for Top Shows
              <View style={styles.emptyCarousel}>
                <Text style={styles.emptyText}>Loading movies...</Text>
              </View>
            )}
          </View>

          {/* Now Showing Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>NOW SHOWING</Text>
                <TouchableOpacity onPress={() => {}}>
                    <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
            </View>
            
            {nowShowing.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.moviesList}>{renderNowShowing}</View>
              </ScrollView>
            ) : (
              <Text style={styles.emptySectionText}>
                No movies now showing.
              </Text>
            )}
          </View>

          {/* Coming Soon Section */}
          <View style={styles.section}>
             <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>COMING SOON</Text>
                <TouchableOpacity onPress={() => {}}>
                    <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
            </View>
            {comingSoon.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.moviesList}>{renderComingSoon}</View>
              </ScrollView>
            ) : (
              <Text style={styles.emptySectionText}>
                No coming soon movies.
              </Text>
            )}
          </View>
          
          {/* Bottom Padding */}
          <View style={{height: 80}} />

        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

// ====== COLORS (match figma) ======
const ACCENT_RED = '#FF315A';
const BG_DARK = '#0F101A';
const CARD_DARK = '#1C1825';
const MUTED_DOT = '#3F3B4E';

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
    paddingTop: 8,
  },

  // header
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 4,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  iconHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  iconButtonPrimary: {
    backgroundColor: ACCENT_RED,
  },
  iconButtonDark: {
    backgroundColor: CARD_DARK,
  },

  // top shows slider
  topShowsContainer: {
    marginBottom: 35,
  },
  topShowSlide: {
    width: '100%',
    height: 220, // Slightly reduced height for better proportions
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    paddingHorizontal: 20,
  },
  topShowImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    resizeMode: 'cover',
  },
  topShowOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  topShowTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },

  // sections
  section: {
    marginBottom: 26,
  },
  moviesList: {
    flexDirection: 'row',
    paddingLeft: 24,
    paddingRight: 10,
  },

  movieCard: {
    marginRight: 16,
    backgroundColor: CARD_DARK,
    borderRadius: 18,
    padding: 6,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  movieImage: {
    width: 140,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 16,
  },
  movieInfoOverlay: {
      padding: 10,
  },
  movieTitleSmall: {
      color: THEME.textWhite,
      fontSize: 14,
      fontWeight: '600',
  },
  emptySectionText: {
    color: THEME.textGray,
    fontSize: 14,
    marginLeft: 24,
    fontStyle: 'italic',
  },
  emptyCarousel: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.cardBg,
    marginHorizontal: 20,
    borderRadius: 24,
  },
  emptyText: {
    color: THEME.textGray,
    fontSize: 16,
  },
});