/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ShowingTimeBookingScreenProps } from '../types/screentypes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CinemaForBookingProps } from '../types/cinema';
import { useSpinner } from '../context/SpinnerContext';
import { useFocusEffect } from '@react-navigation/native';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { CinemaForBooking } from '../components/CinemaForBooking';
import { DateButtonForBooking } from '../components/DateButtonForBooking';
// import { colors } from '../constant/color'; // Replaced with local THEME
import { defaultDateForBooking } from '../constant/variable';
import { getCinemaForBooking } from '../services/CinemaService';
import { ShowingTimeInRoomProps } from '../types/showingTime';
import {
  filterSuitableCinemasForBooking,
  showToast,
  checkErrorFetchingData,
  formatDateToHourseAndMinutes,
} from '../utils/function';

const { width } = Dimensions.get('window');

// THEME CONSTANTS EXTRACTED FROM IMAGE
const THEME = {
  background: '#13141F', // Dark blue-black background
  primaryRed: '#F54B64', // Coral red
  cardBg: '#20212D',     // Slightly lighter for cards
  textWhite: '#FFFFFF',
  textGray: '#8F9BB3',   // Muted blue-gray text
  divider: 'rgba(255,255,255,0.08)',
};

interface FormData {
  movieId: number;
  selectedDate: string;
  selectedTime: ShowingTimeInRoomProps | null;
  cinemaName: string;
}

const ShowingTimeBookingScreen: React.FC<ShowingTimeBookingScreenProps> = ({
  route,
  navigation,
}) => {
  const { movieId, movieTitle } = route.params;

  const dates = useMemo(() => defaultDateForBooking(), [movieId]);
  const [cinemas, setCinemas] = useState<CinemaForBookingProps[]>([]);
  const [tempCinemas, setTempCinemas] = useState<CinemaForBookingProps[]>([]);
  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    watch,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      movieId: movieId,
      selectedDate: dates[0].dateKey,
      selectedTime: null,
      cinemaName: '',
    },
  });

  const [expandedCinemas, setExpandedCinemas] = useState<{
    [cinemaName: string]: boolean;
  }>({});

  const [totalShowtimes, setTotalShowtimes] = useState<{
    [cinemaName: string]: number;
  }>({});

  const { hideSpinner, showSpinner } = useSpinner();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      async function fetchingCinemasForBooking() {
        try {
          showSpinner();
          const responseData = await getCinemaForBooking(movieId);
          if (responseData.code === 1000 && isActive) {
            setCinemas(responseData.result);
            const filteredCinemas = filterSuitableCinemasForBooking(
              responseData.result,
              new Date(),
            );
            setTempCinemas(filteredCinemas);
            setExpandedCinemas(
              Object.fromEntries(
                filteredCinemas.map(cinema => [cinema.name, true]),
              ),
            );
            setTotalShowtimes(
              Object.fromEntries(
                filteredCinemas.map(cinema => [
                  cinema.name,
                  cinema.rooms.reduce(
                    (acc, room) => acc + room.showingTimes.length,
                    0,
                  ),
                ]),
              ),
            );
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
      fetchingCinemasForBooking();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const handleDateChange = useCallback(
    (dateKey: string) => {
      setValue('selectedDate', dateKey);
      const filteredCinemas = filterSuitableCinemasForBooking(
        cinemas,
        new Date(dateKey),
      );
      console.log(filteredCinemas);
      setTempCinemas(filteredCinemas);
      setExpandedCinemas(
        Object.fromEntries(filteredCinemas.map(cinema => [cinema.name, true])),
      );
      setTotalShowtimes(
        Object.fromEntries(
          filteredCinemas.map(cinema => [
            cinema.name,
            cinema.rooms.reduce(
              (acc, room) => acc + room.showingTimes.length,
              0,
            ),
          ]),
        ),
      );
    },
    [cinemas],
  );

  const toggleCinemaExpansion = useCallback((cinemaName: string) => {
    setExpandedCinemas(prev => ({
      ...prev,
      [cinemaName]: !prev[cinemaName],
    }));
  }, []);

  const handleShowingTimeChange = useCallback(
    (showingTime: ShowingTimeInRoomProps) => {
      setValue('selectedTime', showingTime);
    },
    [setValue],
  );

  const handleCinemaChange = useCallback(
    (cinemaName: string) => {
      setValue('cinemaName', cinemaName);
    },
    [setValue],
  );

  const onSubmit: SubmitHandler<FormData> = useCallback(async data => {
    navigation.navigate('SeatSelectionScreen', {
      movieParam: route.params,
      cinemaName: data.cinemaName,
      date: data.selectedDate,
      time: formatDateToHourseAndMinutes(
        new Date(data.selectedTime?.startTime || ''),
      ),
      showingTimeId: data.selectedTime?.showingTimeId || 0,
    });
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.background} />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={THEME.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} ellipsizeMode="tail" numberOfLines={1}>
          {movieTitle}
        </Text>
        <View style={{width: 34}} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* DATE SELECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.datesContainer}
          >
            <Controller
              control={control}
              name="selectedDate"
              render={({ field: { value } }) => (
                <>
                  {dates.map(date => {
                    const isToday = date.dateKey === dates[0].dateKey;
                    const isSelected = value === date.dateKey;

                    return (
                      <DateButtonForBooking
                        key={date.dateKey}
                        date={date}
                        isSelected={isSelected}
                        isToday={isToday}
                        onPress={() => handleDateChange(date.dateKey)}
                      />
                    );
                  })}
                </>
              )}
            />
          </ScrollView>
        </View>

        {/* THEATER & TIME SELECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Theater & Time</Text>
          {tempCinemas.map(eachCinema => (
            <CinemaForBooking
              cinema={eachCinema}
              expandedCinemas={expandedCinemas}
              onShowingTimeChange={handleShowingTimeChange}
              onCinemaNameChange={handleCinemaChange}
              toggleCinemaExpansion={toggleCinemaExpansion}
              totalShowTimes={totalShowtimes}
              selectedTime={watch('selectedTime')}
              key={eachCinema.cinemaId}
            />
          ))}
          {tempCinemas.length === 0 && (
             <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>No showtimes available for this date.</Text>
             </View>
          )}
        </View>
      </ScrollView>

      {/* BOTTOM ACTION BAR */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            {
              backgroundColor: watch('selectedTime')
                ? THEME.primaryRed
                : THEME.cardBg,
              opacity: watch('selectedTime') ? 1 : 0.6,
              shadowOpacity: watch('selectedTime') ? 0.3 : 0,
            },
          ]}
          disabled={isSubmitting || !watch('selectedTime')}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
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
    width: width,
    maxWidth: width,
  },
  backButton: {
    padding: 5,
    borderRadius: 8,
    backgroundColor: THEME.cardBg,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.textWhite,
    textAlign: 'center',
    flex: 1,
    paddingHorizontal: 10,
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
    fontWeight: 'bold',
    color: THEME.textWhite,
    marginBottom: 15,
  },
  // Kept logic for locationContainer but updated colors just in case it's used later
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.cardBg,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
  },
  locationText: {
    flex: 1,
    color: THEME.textGray,
    marginLeft: 10,
    fontSize: 16,
  },
  datesContainer: {
    flexDirection: 'row',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 30, // Safe area
    backgroundColor: THEME.background,
    borderTopWidth: 1,
    borderTopColor: THEME.divider,
  },
  continueButton: {
    paddingVertical: 16,
    borderRadius: 30, // Pill shape
    alignItems: 'center',
    shadowColor: THEME.primaryRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
  emptyState: {
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: THEME.cardBg,
      borderRadius: 12,
  },
  emptyStateText: {
      color: THEME.textGray,
      fontSize: 14,
  }
});

export default ShowingTimeBookingScreen;