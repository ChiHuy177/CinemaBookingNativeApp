/* eslint-disable react-hooks/exhaustive-deps */

import { useMemo, useState, useEffect } from "react";
import { Dimensions, SafeAreaView, StatusBar, View, TouchableOpacity, Text, ScrollView, FlatList, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { DateButtonForBooking } from "../components/DateButtonForBooking";
import MovieItem from "../components/MovieItem";
import { defaultDateForBooking } from "../constant/variable";
import { useSpinner } from "../context/SpinnerContext";
import { getMoviesByCinema } from "../services/MovieService";
import { DateInBookingProps } from "../types/date";
import { MovieListProps } from "../types/movie";
import { CinemaMoviesScreenProps } from "../types/screentypes";
import { showToast, checkErrorFetchingData } from "../utils/function";

// THEME COLORS EXTRACTED FROM IMAGE
const COLORS = {
  background: '#0B0F19', // Deep dark blue/black background
  card: '#1D212E', // Slightly lighter for buttons/cards
  primary: '#F54B46', // Coral red
  text: '#FFFFFF',
  textSecondary: '#7B8299', // Muted text color
};

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
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* Consistent Header Style */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle} ellipsizeMode="tail" numberOfLines={1}>
            {cinemaName}
            </Text>
        </View>
        
        {/* Placeholder to balance the back button */}
        <View style={{width: 40}} />
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
          <View style={styles.movieCountContainer}>
             <Text style={styles.sectionTitle}>Available Movies</Text>
             <Text style={styles.movieCountText}>({movies.length})</Text>
          </View>
          
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
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 10,
    width: width,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.card, // Square button style
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 15,
  },
  movieCountContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginBottom: 15,
  },
  movieCountText: {
      fontSize: 16,
      color: COLORS.textSecondary,
      marginLeft: 8,
      fontWeight: '500',
  },
  datesContainer: {
    flexDirection: 'row',
    // You might need to adjust margin inside DateButtonForBooking component
    // or wrap them in a view with margin here if needed.
    marginLeft: -5, // Offset padding if DateButton has internal padding
  },
});

export default CinemaMoviesScreen;