/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Switched to Ionicons
import {SeatSelectionScreenProps} from '../types/screentypes';
import {SafeAreaView} from 'react-native-safe-area-context';

import {SeatRowForBooking} from '../components/SeatRowForBooking';
import {useFocusEffect} from '@react-navigation/native';
import {SeatRows} from '../constant/variable';
import {useSpinner} from '../context/SpinnerContext';
import {getSeatRowsForBooking} from '../services/SeatService';
import {SeatRowForBookingProps, SeatColumnForBookingProps} from '../types/seat';
import {showToast} from '../utils/function';
import Toast from 'react-native-toast-message';

const {width} = Dimensions.get('window');

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
  // Seat Colors
  seatAvailable: '#3D3E4E',
  seatTaken: '#1A1B25',
  seatVip: '#FFD700', // Gold
  seatSweetBox: '#E056FD', // Purple/Pink
};

const SeatSelectionScreen: React.FC<SeatSelectionScreenProps> = ({
  navigation,
  route,
}) => {
  const {movieParam, cinemaName, date, time, showingTimeId} = route.params;

  const {showSpinner, hideSpinner} = useSpinner();
  const [seats, setSeats] = useState<SeatRowForBookingProps[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<
    SeatColumnForBookingProps[]
  >([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      async function fetchSeats() {
        try {
          showSpinner();
          const responseData = await getSeatRowsForBooking(showingTimeId);
          if (responseData.code === 1000 && isActive) {
            setSeats(responseData.result);
          } else {
            showToast({
              type: 'error',
              text1: 'Seat Error',
              text2: responseData.message || 'Failed to load seats layout.',
            });
          }
        } catch (error) {
             Toast.show({
              type: 'error',
              text1: 'Seat Error',
              text2: 'An unexpected error occurred while fetching seats.',
            });
        } finally {
          hideSpinner();
        }
      }

      fetchSeats();

      return () => {
        isActive = false;
      };
    }, [showingTimeId, movieParam]),
  );

  const handleSeatPress = useCallback(
    (seat: SeatColumnForBookingProps, row: string) => {
      setSeats(prevSeats => {
        return prevSeats.map(seatRow => {
          if (seatRow.row === row) {
            const newStatus =
              seat.status === 'selected' ? 'available' : 'selected';
            if (seat.seatType?.name === 'Sweet Box') {
              const seatColumnNumber = seat.column;
              const isEven = seatColumnNumber % 2 === 0;
              const coupleSeatColumnNumber = isEven
                ? seatColumnNumber - 1
                : seatColumnNumber + 1;

              const pressedSeats = seatRow.seatColumns.filter(
                eachSeat =>
                  eachSeat.column === seatColumnNumber ||
                  eachSeat.column === coupleSeatColumnNumber,
              );

              if (newStatus === 'available') {
                setSelectedSeats(prev =>
                  prev.filter(
                    eachSelectedSeat =>
                      !pressedSeats.some(
                        pressedSeat =>
                          pressedSeat.seatId === eachSelectedSeat.seatId,
                      ),
                  ),
                );
              } else {
                setSelectedSeats(prev => [...prev, ...pressedSeats]);
              }

              return {
                ...seatRow,
                seatColumns: seatRow.seatColumns.map(seatColumn => {
                  if (
                    pressedSeats.some(
                      pressedSeat => pressedSeat.seatId === seatColumn.seatId,
                    ) &&
                    seatColumn.status !== 'taken'
                  ) {
                    return {
                      ...seatColumn,
                      status: newStatus,
                    };
                  }

                  return seatColumn;
                }),
              };
            }

            return {
              ...seatRow,
              seatColumns: seatRow.seatColumns.map(seatColumn => {
                if (
                  seatColumn.seatId === seat.seatId &&
                  seatColumn.status !== 'taken'
                ) {
                  if (newStatus === 'available') {
                    setSelectedSeats(prev =>
                      prev.filter(
                        eachSelectedSeat =>
                          eachSelectedSeat.seatId !== seat.seatId,
                      ),
                    );
                  } else {
                    setSelectedSeats(prev => [...prev, seat]);
                  }

                  return {
                    ...seatColumn,
                    status: newStatus,
                  };
                }

                return seatColumn;
              }),
            };
          }

          return seatRow;
        });
      });
    },
    [],
  );

  const renderRows = useCallback(
    (
      handleSelectSeat: (seat: SeatColumnForBookingProps, row: string) => void,
    ) => {
      let indexRowBase = 0;
      let indexRowState = 0;

      const rowSeats: SeatRowForBookingProps[] = [];

      while (indexRowState < seats.length && indexRowBase < SeatRows.length) {
        if (seats[indexRowState].row === SeatRows[indexRowBase]) {
          rowSeats.push(seats[indexRowState]);
          indexRowState++;
        } else {
          rowSeats.push({
            row: SeatRows[indexRowBase],
            seatColumns: Array.from({length: 14}, (_, i) => ({
              column: i + 1,
              seatId: -i,
              seatType: null,
              status: 'empty',
              row: SeatRows[indexRowBase],
            })),
          });
        }
        indexRowBase++;
      }
      while (indexRowBase < SeatRows.length) {
        rowSeats.push({
          row: SeatRows[indexRowBase],
          seatColumns: Array.from({length: 14}, (_, i) => {
            return {
              column: i + 1,
              seatId: -i,
              seatType: null,
              status: 'empty',
              row: SeatRows[indexRowBase],
            };
          }),
        });
        indexRowBase++;
      }
      return (
        <>
          {rowSeats.map(eachRow => (
            <SeatRowForBooking
              seatRow={eachRow}
              handleSelectSeat={handleSelectSeat}
              key={eachRow.row}
            />
          ))}
        </>
      );
    },
    [seats],
  );

  const coloumnsBase = useMemo(
    () =>
      Array.from({length: 14}, (_, i) => (
        <Text key={i + 1} style={styles.seatNumberText}>
          {i + 1}
        </Text>
      )),
    [],
  );

  const displaySelectedSeats = useMemo(() => {
    return selectedSeats
      .map(seat => seat.row + seat.column.toString())
      .join(', ');
  }, [selectedSeats]);

  const totalPrice = useMemo(() => {
    return selectedSeats.reduce(
      (acc, eachSeat) => acc + (eachSeat.seatType?.price || 0),
      0,
    );
  }, [selectedSeats]);

  const handleSubmitSelectedSeats = useCallback(() => {
    navigation.navigate('ComboBookingScreen', {
      totalPriceSeats: totalPrice,
      selectedSeats: selectedSeats,
      showingTimeParam: route.params,
    });
  }, [selectedSeats]);

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
        <Text style={styles.headerTitle}>Select Seats</Text>
        <View style={{width: 40}} /> 
      </View>

      {/* Movie Info Card */}
      <View style={styles.movieInfoCard}>
        <Text style={styles.movieTitle}>{movieParam.movieTitle}</Text>
        <View style={styles.movieMeta}>
          <View style={styles.metaItem}>
            <Icon name="location-outline" size={14} color={THEME.primaryRed} />
            <Text style={styles.metaText}>{cinemaName}</Text>
          </View>
          <View style={styles.metaItem}>
             <Icon name="calendar-outline" size={14} color={THEME.textGray} />
            <Text style={styles.metaText}>{date}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="time-outline" size={14} color={THEME.textGray} />
            <Text style={styles.metaText}>{time}</Text>
          </View>
        </View>
      </View>

      {/* Screen Visual */}
      <View style={styles.screenContainer}>
        <View style={styles.screenLine} />
        <View style={styles.screenGlow} />
        <Text style={styles.screenText}>SCREEN</Text>
      </View>

      {/* Seats Grid */}
      <ScrollView
        style={styles.seatsScrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 20}}>
        <View style={styles.seatsGrid}>{renderRows(handleSeatPress)}</View>
        <View style={styles.seatNumbers}>{coloumnsBase}</View>
      </ScrollView>

      {/* Legend */}
      <View style={styles.legendContainer}>
        <View style={styles.legendRow}>
            <View style={styles.legendItem}>
                <View
                    style={[styles.legendBox, {backgroundColor: THEME.primaryRed}]}
                />
                <Text style={styles.legendText}>Selected</Text>
            </View>
            <View style={styles.legendItem}>
                <View
                    style={[styles.legendBox, {backgroundColor: THEME.seatAvailable}]}
                />
                <Text style={styles.legendText}>Available</Text>
            </View>
            <View style={styles.legendItem}>
                <View style={[styles.legendBox, {backgroundColor: THEME.seatVip}]} />
                <Text style={styles.legendText}>VIP</Text>
            </View>
        </View>

        <View style={styles.legendRow}>
            <View style={styles.legendItem}>
                <View style={[styles.legendBox, {backgroundColor: THEME.seatSweetBox}]} />
                <Text style={styles.legendText}>Sweet Box</Text>
            </View>
            <View style={styles.legendItem}>
                <View style={[styles.legendBox, {backgroundColor: THEME.seatTaken}]} />
                <Text style={styles.legendText}>Taken</Text>
            </View>
        </View>
      </View>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.selectionLabel}>
             {displaySelectedSeats ? 'Selected Seats:' : 'Select seats'}
          </Text>
          {displaySelectedSeats ? (
              <Text style={styles.selectedSeatsText} numberOfLines={1}>
                {displaySelectedSeats}
              </Text>
          ) : null}
          <Text style={styles.totalPrice}>
            {totalPrice.toLocaleString('vi-VN')} đ
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedSeats.length === 0 && styles.disabledButton,
          ]}
          disabled={selectedSeats.length === 0}
          activeOpacity={0.8}
          onPress={() => handleSubmitSelectedSeats()}>
          <Text style={styles.continueText}>Confirm</Text>
          <Icon name="arrow-forward" size={20} color="#FFF" style={{marginLeft: 5}} />
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
  },

  // Movie Info
  movieInfoCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    backgroundColor: THEME.cardBg,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.textWhite,
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  movieMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: THEME.textGray,
    fontWeight: '500',
  },

  // Screen
  screenContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
    height: 30,
    justifyContent: 'flex-end',
  },
  screenLine: {
    width: width * 0.85,
    height: 4,
    backgroundColor: THEME.primaryRed,
    borderRadius: 2,
    marginBottom: 5,
    zIndex: 2,
  },
  screenGlow: {
      position: 'absolute',
      top: 0,
      width: width * 0.85,
      height: 40,
      backgroundColor: THEME.primaryRed,
      opacity: 0.15,
      borderTopLeftRadius: 100,
      borderTopRightRadius: 100,
      transform: [{scaleY: -1}], // Flip to make it look like light projection
      zIndex: 1,
  },
  screenText: {
    fontSize: 10,
    color: THEME.textDarkGray,
    letterSpacing: 3,
    fontWeight: '700',
    marginTop: 5,
  },

  // Seats
  seatsScrollView: {
    flex: 1,
    paddingHorizontal: 10,
  },
  seatsGrid: {
    alignItems: 'center',
  },
  seatNumbers: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 30,
    gap: 6, // Approximate gap based on SeatRow implementation
  },
  seatNumberText: {
    fontSize: 10,
    color: THEME.textDarkGray,
    width: 20, // Should match seat width roughly
    textAlign: 'center',
  },

  // Legend
  legendContainer: {
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: 'rgba(255,255,255,0.03)',
      marginHorizontal: 20,
      borderRadius: 16,
      marginBottom: 10,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '32%', 
  },
  legendBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 11,
    color: THEME.textGray,
  },

  // Bottom Bar
  bottomBar: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 15,
    backgroundColor: THEME.background,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceContainer: {
    flex: 1,
    marginRight: 15,
  },
  selectionLabel: {
      fontSize: 11,
      color: THEME.textGray,
  },
  selectedSeatsText: {
      fontSize: 13,
      color: THEME.textWhite,
      fontWeight: '600',
      marginBottom: 2,
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.primaryRed,
    textShadowColor: 'rgba(255, 59, 48, 0.3)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 8,
  },
  continueButton: {
    flexDirection: 'row',
    backgroundColor: THEME.primaryRed,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: THEME.shadowColor,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  disabledButton: {
    backgroundColor: THEME.cardBg,
    shadowOpacity: 0,
    elevation: 0,
  },
  continueText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 0.5,
  },
});

export default SeatSelectionScreen;