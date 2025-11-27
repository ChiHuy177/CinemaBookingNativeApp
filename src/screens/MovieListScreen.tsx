/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MovieListScreenProps} from '../types/screentypes';

import {MovieListProps} from '../types/movie';
import {useSpinner} from '../context/SpinnerContext';
import {Icon} from 'react-native-paper';
import MovieItem from '../components/MovieItem';
import {useFocusEffect} from '@react-navigation/native';
import { searchMovies } from '../services/MovieService';
import { checkErrorFetchingData } from '../utils/function';

// THEME CONSTANTS (Consistent with previous file)
const THEME = {
  background: '#13141F', // Dark blue-black background
  primaryRed: '#F54B64', // The coral red
  cardBg: '#20212D',     // Slightly lighter for elements
  textWhite: '#FFFFFF',
  textGray: '#8F9BB3',
  divider: '#2A2C3A',    // Subtle divider color
};

const MovieListScreen: React.FC<MovieListScreenProps> = ({
  route,
  navigation,
}) => {
  const {searchValue} = route.params;
  const [movies, setMovies] = useState<MovieListProps[]>([]);

  const {hideSpinner, showSpinner} = useSpinner();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      async function getMoviesBySearching() {
        try {
          showSpinner();
          console.log(searchValue, 'Asdasdasda');
          const responseData = await searchMovies(searchValue || '');
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
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={THEME.background} barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}>
          {/* Updated Icon color to white */}
          <Icon source="chevron-left" size={30} color={THEME.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose your films</Text>
        {/* Dummy view to balance the header if needed, or keeping it clean */}
        <View style={{width: 34}} /> 
      </View>

      <ScrollView 
        style={styles.movieList} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {movies.map(eachMovie => (
          <MovieItem
            movie={eachMovie}
            navigate={() =>
              navigation.navigate('MovieDetailScreen', {
                movieId: eachMovie.movieId,
              })
            }
            key={eachMovie.movieId}
            hideSpinner={hideSpinner}
            showSpinner={showSpinner}
          />
        ))}
        {movies.length === 0 && (
            <Text style={styles.emptyText}>No movies found</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background, // Updated to Dark Theme
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: THEME.background,
    // Removed light border, added subtle dark border or none
    borderBottomWidth: 1,
    borderBottomColor: 'transparent', 
  },
  backButton: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: THEME.cardBg, // Added subtle background for back button
  },
  // The 'backArrow' style was unused in JSX but referencing colors, safely ignored or updated if used later
  backArrow: {
    fontSize: 24,
    color: THEME.textWhite,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.textWhite, // White text
    flex: 1,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  // Kept structure but updated colors for unused styles just in case
  menuButton: {
    padding: 4,
  },
  menuIcon: {
    fontSize: 20,
    color: THEME.primaryRed,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'flex-end',
  },
  filterButton: {
    backgroundColor: THEME.cardBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterText: {
    fontSize: 14,
    color: THEME.textGray,
  },
  movieList: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  emptyText: {
      color: THEME.textGray,
      textAlign: 'center',
      marginTop: 50,
      fontSize: 16,
  }
});

export default MovieListScreen;