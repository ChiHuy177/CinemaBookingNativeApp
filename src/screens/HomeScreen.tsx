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
              { backgroundColor: index === activeSlide ? '#fff' : '#666' },
            ]}
          />
        ))}
      </View>
    ),
    [activeSlide, topShows],
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.searchContainer}>
            <Text style={styles.sectionTitle}>Top Shows</Text>
            <View style={styles.iconHeaderContainer}>
              <Pressable
                style={styles.iconButton}
                onPress={() => navigation.navigate('MyTicketsScreen')}
              >
                <Icon source="ticket-confirmation" size={30} color="white" />
              </Pressable>
              <Pressable
                style={styles.iconButton}
                onPress={() => navigation.navigate('SearchScreen')}
              >
                <Icon source="search-web" size={30} color="white" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  safeArea: {
    flex: 1,
  },
  iconHeaderContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButton: {
    marginRight: 10,
  },
  content: {
    flex: 1,
  },
  topShowsContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  topShowSlide: {
    width: width,
    height: 300,
    position: 'relative',
  },
  topShowImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  topShowOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
    padding: 12,
  },
  topShowTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
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
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 15,
  },
  moviesList: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 10,
  },
  movieCard: {
    marginRight: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  movieImage: {
    width: 140,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 12,
  },
});
