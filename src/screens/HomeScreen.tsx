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
                  backgroundColor: index === activeSlide ? THEME.accent : 'rgba(255,255,255,0.2)',
                  width: index === activeSlide ? 20 : 8 // Animated width effect simulation
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
      <StatusBar backgroundColor={THEME.background} barStyle="light-content" />
      
      {/* Decorative Glow */}
      <View style={styles.topGlow} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.headerContainer}>
             <View>
                 <Text style={styles.greetingText}>Welcome back,</Text>
                 <Text style={styles.appNameText}>CINEMA TICKET</Text>
             </View>
             <View style={styles.iconHeaderContainer}>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => navigation.navigate('SearchScreen')}>
                    <Icon name="search-outline" size={24} color={THEME.textWhite} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => navigation.navigate('MyTicketsScreen')}>
                    <Icon name="ticket-outline" size={24} color={THEME.accent} />
                </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  topGlow: {
    position: 'absolute',
    top: -100,
    left: -50,
    width: width,
    height: 300,
    backgroundColor: THEME.accent,
    opacity: 0.05,
    borderRadius: 150,
    transform: [{ scaleX: 1.5 }],
  },
  safeArea: {
    flex: 1,
  },
  headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      paddingTop: 10,
      paddingBottom: 20,
  },
  greetingText: {
      color: THEME.textGray,
      fontSize: 14,
      fontWeight: '500',
  },
  appNameText: {
      color: THEME.textWhite,
      fontSize: 20,
      fontWeight: '800',
      letterSpacing: 0.5,
  },
  iconHeaderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  
  // Top Shows
  topShowsContainer: {
    marginBottom: 35,
  },
  topShowSlide: {
    width: '100%',
    height: 220, // Slightly reduced height for better proportions
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: THEME.accent,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
    backgroundColor: THEME.cardBg,
  },
  topShowImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  topShowOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    justifyContent: 'flex-end',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.3)', // Basic darken
  },
  topShowTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
    marginBottom: 8,
    maxWidth: '80%',
  },
  watchNowBtn: {
      backgroundColor: THEME.accent,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12,
      alignSelf: 'flex-start',
  },
  watchNowText: {
      color: '#FFF',
      fontWeight: '700',
      fontSize: 12,
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

  // Sections
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      marginBottom: 16,
  },
  sectionTitle: {
    color: THEME.textWhite,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  seeAllText: {
      color: THEME.accent,
      fontSize: 13,
      fontWeight: '600',
  },
  moviesList: {
    flexDirection: 'row',
    paddingLeft: 24,
    paddingRight: 10,
  },
  movieCard: {
    marginRight: 16,
    borderRadius: 16,
    width: 140,
    overflow: 'hidden',
    backgroundColor: THEME.cardBg,
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