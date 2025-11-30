/* eslint-disable react-hooks/exhaustive-deps */
import {useCallback, useState} from 'react';
import {FavoriteScreenProps} from '../types/screentypes';
import {MovieListProps} from '../types/movie';
import {useSpinner} from '../context/SpinnerContext';

import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import MovieItem from '../components/MovieItem';
import {useFocusEffect} from '@react-navigation/native';
import { getFavoriteMovies } from '../services/MovieService';
import { checkErrorFetchingData } from '../utils/function';

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
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorite Films</Text>
      </View>

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2F2F2F',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 4,
  },
  backArrow: {
    fontSize: 24,
    color: '#FF8133',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  menuButton: {
    padding: 4,
  },
  menuIcon: {
    fontSize: 20,
    color: '#FF8133',
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'flex-end',
  },
  filterButton: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterText: {
    fontSize: 14,
    color: '#C5C5C5',
  },
  movieList: {
    flex: 1,
  },
});
