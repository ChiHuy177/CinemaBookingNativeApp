/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MovieListScreenProps} from '../types/screentypes';
import Icon from 'react-native-vector-icons/Ionicons'; // Switched to Ionicons

import {MovieListProps} from '../types/movie';
import {useSpinner} from '../context/SpinnerContext';
import MovieItem from '../components/MovieItem';
import {useFocusEffect} from '@react-navigation/native';
import {searchMovies} from '../services/MovieService';
import {checkErrorFetchingData} from '../utils/function';

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
  border: 'rgba(255, 255, 255, 0.05)',
};

const MovieListScreen: React.FC<MovieListScreenProps> = ({
  route,
  navigation,
}) => {
  const {searchValue} = route.params;
  const [movies, setMovies] = useState<MovieListProps[]>([]);

  const {hideSpinner, showSpinner} = useSpinner();
  
  console.log(searchValue)

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      async function getMoviesBySearching() {
        try {
          showSpinner();
          // Ideally remove console.log in production, keeping for debugging if needed
          // console.log(searchValue, 'Searching...'); 
          const responseData = await searchMovies(searchValue || '');
          console.log(responseData)
          if (responseData.code === 1000 && isActive) {
            setMovies(responseData.result);
          }
        } catch (error) {
          checkErrorFetchingData({
            error: error,
            title: 'Error searching movies',
          });
        } finally {
          hideSpinner();
        }
      }
      getMoviesBySearching();

      return () => {
        isActive = false;
      };
    }, [searchValue]),
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={THEME.background} barStyle="light-content" />

      {/* Header with Visual Depth */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color={THEME.textWhite} />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Search Results</Text>
            {searchValue ? (
                 <Text style={styles.subHeaderTitle} numberOfLines={1}>"{searchValue}"</Text>
            ) : null}
        </View>

        {/* Placeholder for balance or filter icon */}
        <View style={styles.placeholderIcon} />
      </View>

      <ScrollView
        style={styles.movieList}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        
        {/* Render Movies */}
        {movies.map(eachMovie => (
          <View key={eachMovie.movieId} style={styles.movieItemWrapper}>
            <MovieItem
              movie={eachMovie}
              navigate={() =>
                navigation.navigate('MovieDetailScreen', {
                  movieId: eachMovie.movieId,
                })
              }
              hideSpinner={hideSpinner}
              showSpinner={showSpinner}
            />
          </View>
        ))}

        {/* Empty State with Visuals */}
        {movies.length === 0 && (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
                <Icon name="film-outline" size={50} color={THEME.textDarkGray} />
                <View style={styles.emptyIconGlow} />
            </View>
            <Text style={styles.emptyText}>No movies found</Text>
            <Text style={styles.emptySubText}>Try searching for another title.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: THEME.background,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: THEME.glass, // Glass effect
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  placeholderIcon: {
      width: 40,
  },
  titleContainer: {
      alignItems: 'center',
      flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.textWhite,
    letterSpacing: 0.5,
  },
  subHeaderTitle: {
      fontSize: 12,
      color: THEME.primaryRed,
      marginTop: 2,
      maxWidth: width * 0.5,
  },
  movieList: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  movieItemWrapper: {
      marginBottom: 15,
      // Note: Assuming MovieItem handles its own card styling, 
      // but if not, we could add a wrapper background here.
      // For now, we rely on the component but ensure spacing is consistent.
  },
  
  // Empty State Styling
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  emptyIconContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: THEME.cardBg,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
      position: 'relative',
      borderWidth: 1,
      borderColor: THEME.border,
  },
  emptyIconGlow: {
      position: 'absolute',
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: THEME.primaryRed,
      opacity: 0.1,
  },
  emptyText: {
    color: THEME.textWhite,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubText: {
      color: THEME.textGray,
      fontSize: 14,
  }
});

export default MovieListScreen;