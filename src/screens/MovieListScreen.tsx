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
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon source="chevron-left" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose your films</Text>
      </View>

      <ScrollView style={styles.movieList} showsVerticalScrollIndicator={false}>
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
    color: '#FFF',
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

export default MovieListScreen;
