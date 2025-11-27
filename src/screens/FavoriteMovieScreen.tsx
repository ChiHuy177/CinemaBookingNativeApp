/* eslint-disable react-hooks/exhaustive-deps */
import {useCallback, useState} from 'react';
import {FavoriteScreenProps} from '../types/screentypes';
import {MovieListProps} from '../types/movie';
import {useSpinner} from '../context/SpinnerContext';

import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import MovieItem from '../components/MovieItem';
import {useFocusEffect} from '@react-navigation/native';
import {getFavoriteMovies} from '../services/MovieService';
import {checkErrorFetchingData} from '../utils/function';

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
      <StatusBar backgroundColor="#2F2F2F" barStyle="light-content" />
      <View style={styles.header}>
        {/* Header content. Assuming this is a tab screen, so no back button is added here. */}
        <Text style={styles.headerTitle}>Phim Yêu Thích</Text>
      </View>

      {isListEmpty ? (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>
            Bạn chưa thêm bộ phim yêu thích nào.
          </Text>
          <Text style={styles.emptyStateSubText}>
            Tìm kiếm và nhấn vào biểu tượng trái tim để thêm phim!
          </Text>
          {/*  - A relevant image for an empty favorite list could be added here if allowed. */}
        </View>
      ) : (
        <ScrollView style={styles.movieList} showsVerticalScrollIndicator={false}>
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
    backgroundColor: '#2F2F2F', // Dark background for the whole screen
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the title better
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#444444', // Darker border color for dark theme
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    // The previous text alignment was managed by flex: 1 and margin, but here we center it directly.
  },
  movieList: {
    flex: 1,
    paddingHorizontal: 16, // Added padding for better list appearance
  },
  // --- New styles for Empty State ---
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#CCCCCC', // Light gray color
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#888888', // Medium gray color
    textAlign: 'center',
  },
  // The following styles are unused in the final JSX but were in the original, keeping them for reference/future use, but simplifying the list.
  // backButton: { padding: 4, },
  // backArrow: { fontSize: 24, color: '#FF8133', fontWeight: 'bold', },
  // menuButton: { padding: 4, },
  // menuIcon: { fontSize: 20, color: '#FF8133', },
  // filterContainer: { paddingHorizontal: 16, paddingVertical: 8, alignItems: 'flex-end', },
  // filterButton: { backgroundColor: '#F5F5F5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, },
  // filterText: { fontSize: 14, color: '#C5C5C5', },
});