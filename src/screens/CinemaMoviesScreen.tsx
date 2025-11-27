/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useMemo, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {CinemaMoviesScreenProps} from '../types/screentypes';
import {SafeAreaView} from 'react-native-safe-area-context';
import {defaultDateForBooking} from '../constants/variables';
import {MovieListProps} from '../types/movie';
import {DateInBookingProps} from '../types/date';
import {colors} from '../constants/colors';
import {useSpinner} from '../context/SpinnerContext';
import {checkErrorFetchingData, showToast} from '../utils/functions';
import {getMoviesByCinema} from '../api/services/movie.service';
import {DateButtonForBooking} from '../components/DateButtonForBooking';
import MovieItem from '../components/MovieItem';

const {width} = Dimensions.get('window');

const CinemaMoviesScreen: React.FC<CinemaMoviesScreenProps> = ({
  navigation,
  route,
}) => {
  const {cinemaId, cinemaName} = route.params;
  const dates = useMemo(() => defaultDateForBooking(), []);
  const [selectedDate, setSelectedDate] = useState<DateInBookingProps>(
    dates[0],
  );
  const [movies, setMovies] = useState<MovieListProps[]>([]);
  const {showSpinner, hideSpinner} = useSpinner();

  useEffect(() => {
    async function fetchMovies() {
      try {
        showSpinner();
        const date = new Date(selectedDate.dateKey);
        const formatted = date.toISOString().split('T')[0];
        console.log(cinemaId, formatted);
        const responseData = await getMoviesByCinema(cinemaId, formatted);
        if (responseData.code === 1000) {
          setMovies(responseData.result);
        } else {
          showToast({
            type: 'error',
            text1: responseData.message,
          });
        }
      } catch (error) {
        checkErrorFetchingData({
          error: error,
          title: 'Error fetching cinemas',
        });
      } finally {
        hideSpinner();
      }
    }

    fetchMovies();
  }, [selectedDate, cinemaId]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} ellipsizeMode="tail" numberOfLines={1}>
          {cinemaName}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.datesContainer}>
            {dates.map(date => {
              const isToday = date.dateKey === dates[0].dateKey;
              const isSelected = selectedDate.dateKey === date.dateKey;

              return (
                <DateButtonForBooking
                  key={date.dateKey}
                  date={date}
                  isSelected={isSelected}
                  isToday={isToday}
                  onPress={() => setSelectedDate(date)}
                />
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>({movies.length} movies)</Text>
          <FlatList
            data={movies}
            keyExtractor={item => item.movieId.toString()}
            renderItem={({item}) => (
              <MovieItem
                movie={item}
                hideSpinner={hideSpinner}
                navigate={() =>
                  navigation.navigate('MovieDetailScreen', {
                    movieId: item.movieId,
                  })
                }
                showSpinner={showSpinner}
                key={item.movieId}
              />
            )}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.dark,
    width: width,
    maxWidth: width,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
    textAlign: 'center',
    paddingRight: 50,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 15,
  },
  datesContainer: {
    flexDirection: 'row',
  },
});

export default CinemaMoviesScreen;
