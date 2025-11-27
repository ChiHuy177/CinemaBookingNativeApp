/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useMemo, useState} from 'react';
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
import {ShowingTimeBookingScreenProps} from '../types/screentypes';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CinemaForBookingProps} from '../types/cinema';
import {useSpinner} from '../context/SpinnerContext';
import {
  checkErrorFetchingData,
  filterSuitableCinemasForBooking,
  formatDateToHourseAndMinutes,
  showToast,
} from '../utils/functions';
import {getCinemaForBooking} from '../api/services/cinema.service';
import {defaultDateForBooking} from '../constants/variables';
import {ShowingTimeInRoomProps} from '../types/showingTime';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {DateButtonForBooking} from '../components/DateButtonForBooking';
import {CinemaForBooking} from '../components/CinemaForBooking';
import {colors} from '../constants/colors';
import {useFocusEffect} from '@react-navigation/native';

const {width} = Dimensions.get('window');

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
  const {movieId, movieTitle} = route.params;

  const dates = useMemo(() => defaultDateForBooking(), [movieId]);
  const [cinemas, setCinemas] = useState<CinemaForBookingProps[]>([]);
  const [tempCinemas, setTempCinemas] = useState<CinemaForBookingProps[]>([]);
  const {
    control,
    formState: {isSubmitting},
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

  const {hideSpinner, showSpinner} = useSpinner();

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
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} ellipsizeMode="tail" numberOfLines={1}>
          {movieTitle}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.datesContainer}>
            <Controller
              control={control}
              name="selectedDate"
              render={({field: {value}}) => (
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
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            {
              backgroundColor: watch('selectedTime')
                ? colors.primary
                : colors.lightGray,
              opacity: watch('selectedTime') ? 1 : 0.5,
            },
          ]}
          disabled={isSubmitting || !watch('selectedTime')}
          onPress={handleSubmit(onSubmit)}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#1a1a1a',
    width: width,
    maxWidth: width,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
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
    color: '#fff',
    marginBottom: 15,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
  },
  locationText: {
    flex: 1,
    color: '#ccc',
    marginLeft: 10,
    fontSize: 16,
  },
  datesContainer: {
    flexDirection: 'row',
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#1a1a1a',
  },
  continueButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ShowingTimeBookingScreen;
