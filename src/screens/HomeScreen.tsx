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
import {Icon} from 'react-native-paper';

import {useFocusEffect} from '@react-navigation/native';
import {
  showToast,
  checkErrorFetchingData,
  getPosterImage,
}
// Removed the redundant import path (../utils/function) to assume it's correctly mapped in React Native environment
from '../utils/function';
import {movieMainHome} from '../services/MovieService';

const {width} = Dimensions.get('window');

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
              text1: 'Lỗi', // Localized the toast message
              text2: responseData.message || 'Không thể tải phim',
            });
          }
        } catch (error) {
          checkErrorFetchingData({
            error: error,
            title: 'Lỗi khi tải phim trang chủ', // Localized the error title
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
        style={{width}} // Explicitly setting width for correct paging
      >
        <View key={item.movieId} style={styles.topShowSlide}>
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
              {backgroundColor: index === activeSlide ? '#FF8133' : '#666'}, // Changed active color to theme orange
            ]}
          />
        ))}
      </View>
    ),
    [activeSlide, topShows],
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#1a1a1a" barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header and Search/Tickets Icons */}
          <View style={styles.searchContainer}>
            <Text style={styles.sectionTitle}>Phim Nổi Bật</Text>
            <View style={styles.iconHeaderContainer}>
              <Pressable
                style={styles.iconButton}
                onPress={() => navigation.navigate('MyTicketsScreen')}>
                <Icon source="ticket-confirmation" size={28} color="#FF8133" />
              </Pressable>
              <Pressable
                style={styles.iconButton}
                onPress={() => navigation.navigate('SearchScreen')}>
                <Icon source="search-web" size={28} color="#FF8133" />
              </Pressable>
            </View>
          </View>

          {/* Top Shows Carousel */}
          <View style={styles.topShowsContainer}>
            {topShows.length > 0 ? (
              <>
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={event => {
                    const slideIndex = Math.round(
                      event.nativeEvent.contentOffset.x / width,
                    );
                    setActiveSlide(slideIndex);
                  }}>
                  {topShows.map(renderTopShow)}
                </ScrollView>
                {renderDots()}
              </>
            ) : (
              // Empty state for Top Shows
              <View style={styles.emptyCarousel}>
                <Text style={styles.emptyText}>Đang tải phim...</Text>
              </View>
            )}
          </View>

          {/* Now Showing Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Đang Chiếu</Text>
            {nowShowing.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.moviesList}>{renderNowShowing}</View>
              </ScrollView>
            ) : (
              <Text style={styles.emptySectionText}>
                Hiện chưa có phim nào đang chiếu.
              </Text>
            )}
          </View>

          {/* Coming Soon Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sắp Chiếu</Text>
            {comingSoon.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.moviesList}>{renderComingSoon}</View>
              </ScrollView>
            ) : (
              <Text style={styles.emptySectionText}>
                Chưa có thông tin về phim sắp chiếu.
              </Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a', // Dark theme background
  },
  safeArea: {
    flex: 1,
  },
  iconHeaderContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 15, // Increased gap for better spacing
    alignItems: 'center',
    marginRight: 10,
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20, // Added padding to align with section titles
    paddingTop: 10,
    marginBottom: 20,
  },
  iconButton: {
    // Removed marginRight: 10 as gap handles spacing
    padding: 5, // Increased touch area
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
    // Added border radius for visual appeal
    borderRadius: 15,
    overflow: 'hidden',
  },
  topShowImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Changed to cover for better filling
  },
  topShowOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // Using a simple semi-transparent black overlay instead of CSS linear-gradient string
    backgroundColor: 'rgba(0,0,0,0.6)', 
    padding: 12,
  },
  topShowTitle: {
    color: '#fff',
    fontSize: 22, // Increased font size
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Added text shadow for visibility
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
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
    fontSize: 22, // Increased font size for titles
    fontWeight: '700', // Bold
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
    // Added shadow to movie cards
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
  },
  movieImage: {
    width: 120, // Adjusted width for better fit on small screens
    height: 180, // Adjusted height
    resizeMode: 'cover',
    borderRadius: 12,
  },
  emptySectionText: {
    color: '#999',
    fontSize: 16,
    marginLeft: 20,
    paddingBottom: 10,
  },
  emptyCarousel: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    marginHorizontal: 20,
    borderRadius: 15,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
  },
});