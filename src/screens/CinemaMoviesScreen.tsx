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
      <StatusBar barStyle="light-content" backgroundColor={THEME.background} />

      {/* Decorative Glow */}
      <View style={styles.topGlow} />

      {/* Consistent Header Style */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={THEME.textWhite} />
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
          <Text style={styles.sectionTitle}>SELECT DATE</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.datesContainer}
            contentContainerStyle={{paddingRight: 20}} // Add padding to end of scroll
          >
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
             <Text style={styles.sectionTitle}>AVAILABLE MOVIES</Text>
             <View style={styles.badge}>
                <Text style={styles.badgeText}>{movies.length}</Text>
             </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 10,
    width: width,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20, // Circular
    backgroundColor: 'rgba(255,255,255,0.1)', // Glassmorphism
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800', // Extra bold
    color: THEME.textWhite,
    textAlign: 'center',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
    marginTop: 10,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.textWhite,
    marginBottom: 15,
    marginLeft: 20, // Align with padding
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  movieCountContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
  },
  badge: {
      backgroundColor: 'rgba(255, 59, 48, 0.2)',
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 8,
      marginLeft: 8,
      marginBottom: 15, // Align with title margin
  },
  badgeText: {
      color: THEME.accent,
      fontSize: 14,
      fontWeight: '700',
  },
  datesContainer: {
    flexDirection: 'row',
    paddingLeft: 20, // Initial padding
  },
});

export default CinemaMoviesScreen;