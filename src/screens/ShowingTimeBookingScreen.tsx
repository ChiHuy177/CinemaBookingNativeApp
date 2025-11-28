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
  // Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Switched to Ionicons
import {ShowingTimeBookingScreenProps} from '../types/screentypes';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CinemaForBookingProps} from '../types/cinema';
import {useSpinner} from '../context/SpinnerContext';
import {useFocusEffect} from '@react-navigation/native';
import {useForm, SubmitHandler, Controller} from 'react-hook-form';
import {CinemaForBooking} from '../components/CinemaForBooking';
import {DateButtonForBooking} from '../components/DateButtonForBooking';
import {defaultDateForBooking} from '../constant/variable';
import {getCinemaForBooking} from '../services/CinemaService';
import {ShowingTimeInRoomProps} from '../types/showingTime';
import {
  filterSuitableCinemasForBooking,
  showToast,
  checkErrorFetchingData,
  formatDateToHourseAndMinutes,
} from '../utils/function';

// const {width} = Dimensions.get('window');

// --- CINEMATIC DARK THEME CONFIGURATION ---
const THEME = {
  background: '#10111D', // Deep Cinematic Blue/Black
  cardBg: '#1C1D2E', // Slightly lighter panel
  primaryRed: '#FF3B30', // Neon/Cinematic Red
  textWhite: '#FFFFFF',
  textGray: '#A0A0B0',
  textDarkGray: '#5C5D6F',
  glass: 'rgba(255, 255, 255, 0.08)',
  border: 'rgba(255, 255, 255, 0.05)',
  shadowColor: '#FF3B30',
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
              text1: 'Data Error',
              text2: responseData.message,
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
      // console.log(filteredCinemas); // Keep clean for prod
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

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.glassButton}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color={THEME.textWhite} />
        </TouchableOpacity>
        <Text
          style={styles.headerTitle}
          ellipsizeMode="tail"
          numberOfLines={1}>
          {movieTitle}
        </Text>
        <View style={{width: 40}} /> 
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20}}>
        
        {/* Date Selection */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Select Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.datesScrollContent}>
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

        {/* Theaters List */}
        <View style={styles.sectionContainer}>
          <View style={styles.theaterHeaderRow}>
            <Text style={styles.sectionHeader}>Cinemas & Showtimes</Text>
            <Icon name="options-outline" size={20} color={THEME.textGray} />
          </View>
          
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
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                 <Icon name="calendar-outline" size={40} color={THEME.textDarkGray} />
              </View>
              <Text style={styles.emptyText}>
                No showtimes found for this date.
              </Text>
              <Text style={styles.emptySubText}>
                  Please select another date.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            {
              backgroundColor: watch('selectedTime')
                ? THEME.primaryRed
                : THEME.cardBg,
              opacity: watch('selectedTime') ? 1 : 0.6,
              shadowOpacity: watch('selectedTime') ? 0.4 : 0,
            },
          ]}
          disabled={isSubmitting || !watch('selectedTime')}
          activeOpacity={0.8}
          onPress={handleSubmit(onSubmit)}>
          <Text style={styles.continueText}>Select Seats</Text>
          {watch('selectedTime') && <Icon name="arrow-forward" size={20} color="#FFF" style={{marginLeft: 8}} />}
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
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  glassButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.glass,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.textWhite,
    textAlign: 'center',
    flex: 1,
    paddingHorizontal: 15,
    letterSpacing: 0.5,
  },
  
  content: {
    flex: 1,
    marginTop: 10,
  },
  
  // Sections
  sectionContainer: {
    marginBottom: 25,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.textWhite,
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  theaterHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingRight: 20,
  },

  // Date Scroll
  datesScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  
  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: THEME.cardBg,
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    marginTop: 10,
  },
  emptyIconCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: 'rgba(255,255,255,0.03)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 15,
  },
  emptyText: {
    color: THEME.textWhite,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  emptySubText: {
      color: THEME.textGray,
      fontSize: 13,
  },

  // Bottom Bar
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 30,
    backgroundColor: THEME.background,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
  },
  continueButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: THEME.shadowColor,
    shadowOffset: {width: 0, height: 8},
    shadowRadius: 16,
    elevation: 8,
  },
  continueText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

export default ShowingTimeBookingScreen;