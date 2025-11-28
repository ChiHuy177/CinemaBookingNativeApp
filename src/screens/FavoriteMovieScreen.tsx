/* eslint-disable react-hooks/exhaustive-deps */
import {useCallback, useState} from 'react';
import {FavoriteScreenProps} from '../types/screentypes';
import {MovieListProps} from '../types/movie';
import {useSpinner} from '../context/SpinnerContext';

import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, StatusBar, StyleSheet, Text, View, Dimensions, TouchableOpacity} from 'react-native';
import MovieItem from '../components/MovieItem';
import {useFocusEffect} from '@react-navigation/native';
import {getFavoriteMovies} from '../services/MovieService';
import {checkErrorFetchingData} from '../utils/function';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

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

export const FavoriteMovieScreen: React.FC<FavoriteScreenProps> = ({
  navigation,
}) => {
  const [movies, setMovies] = useState<MovieListProps[]>([]);
  const {showSpinner, hideSpinner} = useSpinner();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchFavoriteMovies = async () => {
        try {
          showSpinner();
          const responseData = await getFavoriteMovies();
          if (responseData.code === 1000 && isActive) {
            setMovies(responseData.result);
          }
        } catch (error) {
          checkErrorFetchingData({
            error,
            title: 'Error getting favorite movies',
          });
        } finally {
          hideSpinner();
        }
      };

      fetchFavoriteMovies();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const isListEmpty = movies.length === 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={THEME.background} barStyle="light-content" />
      
      {/* Decorative Glow */}
      <View style={styles.topGlow} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIconContainer}>
            <Icon name="heart" size={24} color={THEME.accent} />
        </View>
        <View>
            <Text style={styles.headerTitle}>FAVORITE MOVIES</Text>
            <Text style={styles.headerSubtitle}>Your personal collection</Text>
        </View>
      </View>

      {isListEmpty ? (
        <View style={styles.emptyStateContainer}>
          <View style={styles.emptyIconContainer}>
             <Icon name="heart-dislike-outline" size={60} color={THEME.textPlaceholder} />
          </View>
          <Text style={styles.emptyStateText}>
            No favorite movies yet.
          </Text>
          <Text style={styles.emptyStateSubText}>
            Search and tap the heart icon to add movies to your collection!
          </Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => navigation.navigate('HomeStack', { screen: 'HomeScreen' } as any)}
          >
             <Text style={styles.browseButtonText}>Browse Movies</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
            style={styles.movieList} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.movieListContent}
        >
          {movies.map(eachMovie => (
            <MovieItem
              movie={eachMovie}
              navigate={() =>
                navigation.navigate('HomeStack', {
                  screen: 'MovieDetailScreen',
                  params: {
                    movieId: eachMovie.movieId,
                  },
                })
              }
              key={eachMovie.movieId}
              hideSpinner={hideSpinner}
              showSpinner={showSpinner}
            />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginTop: 10,
  },
  headerIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor: 'rgba(255, 59, 48, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
      borderWidth: 1,
      borderColor: 'rgba(255, 59, 48, 0.2)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.textWhite,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  headerSubtitle: {
      fontSize: 14,
      color: THEME.textGray,
      fontWeight: '500',
  },
  
  movieList: {
    flex: 1,
  },
  movieListContent: {
      paddingHorizontal: 20,
      paddingBottom: 20,
  },

  // Empty State Styles
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    marginTop: -50, // Visual adjustment
  },
  emptyIconContainer: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: 'rgba(255,255,255,0.03)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.05)',
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.textWhite,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateSubText: {
    fontSize: 14,
    color: THEME.textGray,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  browseButton: {
      backgroundColor: THEME.accent,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 24,
      shadowColor: THEME.accent,
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
  },
  browseButtonText: {
      color: THEME.textWhite,
      fontSize: 14,
      fontWeight: '700',
  },
});