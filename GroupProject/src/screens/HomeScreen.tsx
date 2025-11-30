/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useMemo, useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { MovieMainHomeProps } from '../types/movie';
import { useSpinner } from '../context/SpinnerContext';

import { HomeScreenProps } from '../types/screentypes';
import { Icon } from 'react-native-paper';

import { useFocusEffect } from '@react-navigation/native';
import {
  showToast,
  checkErrorFetchingData,
  getPosterImage,
} from '../utils/function';
import { movieMainHome } from '../services/MovieService';

const { width } = Dimensions.get('window');

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [topShows, setTopShows] = useState<MovieMainHomeProps[]>([]);
  const [nowShowing, setNowShowing] = useState<MovieMainHomeProps[]>([]);
  const [comingSoon, setComingSoon] = useState<MovieMainHomeProps[]>([]);
  const { showSpinner, hideSpinner } = useSpinner();

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
              text2: responseData.message || 'Failed to fetch movies',
            });
          }
        } catch (error) {
          checkErrorFetchingData({
            error: error,
            title: 'Error fetching main home movies',
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
      >
        <View key={item.movieId} style={styles.topShowSlide}>
          <Image
            source={{ uri: getPosterImage(item.posterURL) }}
            style={styles.topShowImage}
          />
          <View style={styles.topShowOverlay}>
            <Text
              style={styles.topShowTitle}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {item.title}
            </Text>
          </View>
        </View>
      </Pressable>
    ),
    [],
  );

  const renderMovieCard = useCallback((item: MovieMainHomeProps) => {
    return (
      <TouchableOpacity
        key={item.movieId}
        style={styles.movieCard}
        onPress={() =>
          navigation.navigate('MovieDetailScreen', {
            movieId: item.movieId,
          })
        }
      >
        <Image
          source={{ uri: getPosterImage(item.posterURL) }}
          style={styles.movieImage}
        />
      </TouchableOpacity>
    );
  }, []);

  const renderNowShowing = useMemo(() => {
    return nowShowing.map(renderMovieCard);
  }, [nowShowing]);

  const renderComingSoon = useMemo(() => {
    return comingSoon.map(renderMovieCard);
  }, [comingSoon]);

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
          <View style={styles.topShowsContainer}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={event => {
                const slideIndex = Math.round(
                  event.nativeEvent.contentOffset.x / width,
                );
                setActiveSlide(slideIndex);
              }}
            >
              {topShows.map(renderTopShow)}
            </ScrollView>
            {renderDots()}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Now Showing</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.moviesList}>{renderNowShowing}</View>
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Coming Soon</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.moviesList}>{renderComingSoon}</View>
            </ScrollView>
          </View>
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
    position: 'relative',
    marginBottom: 40,
  },
  topShowSlide: {
    width: width,
    height: 300,
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
    position: 'absolute',
    bottom: -20,
    left: 0,
    right: 0,
  },
  dot: {
    width: 8,
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
    paddingLeft: 20,
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
    borderRadius: 12,
  },
});
