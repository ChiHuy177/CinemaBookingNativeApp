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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { ShowingTimeBookingScreenProps } from '../types/screentypes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CinemaForBookingProps } from '../types/cinema';
import { useSpinner } from '../context/SpinnerContext';
import { useFocusEffect } from '@react-navigation/native';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { CinemaForBooking } from '../components/CinemaForBooking';
import { DateButtonForBooking } from '../components/DateButtonForBooking';
import { defaultDateForBooking } from '../constant/variable';
import { getCinemaForBooking } from '../services/CinemaService';
import { ShowingTimeInRoomProps } from '../types/showingTime';
import {
  filterSuitableCinemasForBooking,
  showToast,
  checkErrorFetchingData,
  formatDateToHourseAndMinutes,
} from '../utils/function';

// --- THEME: match HomeScreen ---
const THEME = {
  background: '#10111D', // same as HomeScreen
  cardBg: '#1F2130', // same card background
  accent: '#FF3B30', // same accent
  primaryRed: '#FF3B30',
  textWhite: '#FFFFFF',
  textGray: '#8F90A6',
  textDarkGray: '#5C5E6F',
  textPlaceholder: '#5C5E6F',
  error: '#FF3B30',
  glass: 'rgba(255,255,255,0.06)',
  border: 'rgba(255,255,255,0.08)',
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
    [cinemas, setValue],
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

  const onSubmit: SubmitHandler<FormData> = useCallback(
    async data => {
      navigation.navigate('SeatSelectionScreen', {
        movieParam: route.params,
        cinemaName: data.cinemaName,
        date: data.selectedDate,
        time: formatDateToHourseAndMinutes(
          new Date(data.selectedTime?.startTime || ''),
        ),
        showingTimeId: data.selectedTime?.showingTimeId || 0,
      });
    },
    [navigation, route.params],
  );

  return (
    <View style={styles.outerContainer}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.background} />
      {/* Glow giống HomeScreen */}
      <View style={styles.topGlow} />

      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-back" size={24} color={THEME.textWhite} />
          </TouchableOpacity>
          <View style={styles.headerTitleWrapper}>
            <Text
              style={styles.headerTitle}
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {movieTitle}
            </Text>
            <Text style={styles.headerSubtitle}>Choose date & cinema</Text>
          </View>
          <View style={styles.headerRightPlaceholder} />
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          {/* Date Selection */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>SELECT DATE</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.datesScrollContent}
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

          {/* Cinemas & Showtimes */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>CINEMAS & SHOWTIMES</Text>
              <TouchableOpacity activeOpacity={0.8}>
                <Icon name="options-outline" size={20} color={THEME.textGray} />
              </TouchableOpacity>
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
                  <Icon
                    name="calendar-outline"
                    size={40}
                    color={THEME.textDarkGray}
                  />
                </View>
                <Text style={styles.emptyText}>
                  No showtimes found for this date.
                </Text>
                <Text style={styles.emptySubText}>
                  Please select another date to continue.
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
                  ? THEME.accent
                  : THEME.cardBg,
                opacity: watch('selectedTime') ? 1 : 0.6,
                shadowOpacity: watch('selectedTime') ? 0.4 : 0,
              },
            ]}
            disabled={isSubmitting || !watch('selectedTime')}
            activeOpacity={0.85}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.continueText}>Select Seats</Text>
            {watch('selectedTime') && (
              <Icon
                name="arrow-forward"
                size={20}
                color="#FFF"
                style={{ marginLeft: 8 }}
              />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  topGlow: {
    position: 'absolute',
    top: -100,
    left: -50,
    right: 0,
    height: 260,
    backgroundColor: THEME.accent,
    opacity: 0.05,
    borderRadius: 150,
    transform: [{ scaleX: 1.5 }],
  },
  container: {
    flex: 1,
  },

  // Header giống vibe HomeScreen
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleWrapper: {
    flex: 1,
    marginHorizontal: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.textWhite,
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    marginTop: 2,
    fontSize: 12,
    color: THEME.textGray,
  },
  headerRightPlaceholder: {
    width: 40,
  },

  content: {
    flex: 1,
  },

  // Sections giống style section ở HomeScreen
  section: {
    marginBottom: 30,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    color: THEME.textWhite,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },

  // Date Scroll
  datesScrollContent: {
    paddingHorizontal: 24,
    gap: 12,
  },

  // Empty State card style giống card của Home
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: THEME.cardBg,
    marginHorizontal: 24,
    borderRadius: 20,
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
    textAlign: 'center',
  },

  // Bottom Bar giống button đặt vé ở Home (BOOK NOW)
  bottomBar: {
    paddingHorizontal: 24,
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
    shadowOffset: { width: 0, height: 8 },
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
