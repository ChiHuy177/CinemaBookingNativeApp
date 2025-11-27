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
import Icon from 'react-native-vector-icons/MaterialIcons';
import {SeatSelectionScreenProps} from '../types/screentypes';
import {SafeAreaView} from 'react-native-safe-area-context';

import {SeatRowForBooking} from '../components/SeatRowForBooking';
import {useFocusEffect} from '@react-navigation/native';
// import { colors } from '../constant/color'; // Replaced with local THEME
import { SeatRows } from '../constant/variable';
import { useSpinner } from '../context/SpinnerContext';
import { getSeatRowsForBooking } from '../services/SeatService';
import { SeatRowForBookingProps, SeatColumnForBookingProps } from '../types/seat';
import { showToast } from '../utils/function';

const {width} = Dimensions.get('window');

// THEME CONSTANTS EXTRACTED FROM IMAGE
const THEME = {
  background: '#13141F', // Dark blue-black background
  primaryRed: '#F54B64', // Coral red
  cardBg: '#20212D',     // Slightly lighter for cards
  textWhite: '#FFFFFF',
  textGray: '#8F9BB3',   // Muted blue-gray text
  divider: 'rgba(255,255,255,0.08)',
  // Seat Colors
  seatAvailable: '#3D3E4E',
  seatTaken: '#1A1B25',
  seatVip: '#FFD700',    // Gold
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
              text1: responseData.message || 'Failed to fetch seats',
            });
          }
        } catch (error) {
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
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={THEME.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Seats</Text>
        <View style={{width: 34}} /> 
      </View>

      {/* MOVIE INFO CARD */}
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle}>{movieParam.movieTitle}</Text>
        <View style={styles.movieDetails}>
          <View style={styles.detailItem}>
            <Icon name="location-on" size={14} color={THEME.textGray} />
            <Text style={styles.detailValue}>{cinemaName}</Text>
          </View>
          <View style={styles.detailItem}>
             <Icon name="calendar-today" size={14} color={THEME.textGray} />
            <Text style={styles.detailValue}>{date}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="access-time" size={14} color={THEME.textGray} />
            <Text style={styles.detailValue}>{time}</Text>
          </View>
        </View>
      </View>

      {/* SCREEN VISUAL */}
      <View style={styles.screenContainer}>
        <View style={styles.screen} />
        <Text style={styles.screenText}>SCREEN</Text>
      </View>

      {/* SEATS GRID */}
      <ScrollView
        style={styles.seatsScrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.seatsGrid}>{renderRows(handleSeatPress)}</View>
        <View style={styles.seatNumbers}>{coloumnsBase}</View>
      </ScrollView>

      {/* LEGEND / ANNOTATION */}
      <View style={styles.legendContainer}>
        <View style={styles.legendRow}>
            <View style={styles.legendItem}>
                <View
                    style={[styles.legendSeat, {backgroundColor: THEME.primaryRed}]}
                />
                <Text style={styles.legendText}>Selected</Text>
            </View>
            <View style={styles.legendItem}>
                <View
                    style={[styles.legendSeat, {backgroundColor: THEME.seatAvailable}]}
                />
                <Text style={styles.legendText}>Normal</Text>
            </View>
            <View style={styles.legendItem}>
                <View style={[styles.legendSeat, {backgroundColor: THEME.seatVip}]} />
                <Text style={styles.legendText}>VIP</Text>
            </View>
        </View>

        <View style={styles.legendRow}>
            <View style={styles.legendItem}>
                <View style={[styles.legendSeat, {backgroundColor: THEME.seatSweetBox}]} />
                <Text style={styles.legendText}>Sweet Box</Text>
            </View>
            <View style={styles.legendItem}>
                <View style={[styles.legendSeat, {backgroundColor: THEME.seatTaken}]} />
                <Text style={styles.legendText}>Taken</Text>
            </View>
        </View>
      </View>

      {/* BOTTOM ACTION BAR */}
      <View style={styles.bottomSection}>
        <View style={styles.selectionInfo}>
          <Text style={styles.selectedSeatsText}>
            <Text style={{color: THEME.textGray}}>Selected: </Text>
            {displaySelectedSeats || 'None'}
          </Text>
          <Text style={styles.totalText}>
            {totalPrice.toLocaleString('vi-VN') + 'đ'}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedSeats.length === 0 && styles.disabledButton,
          ]}
          disabled={selectedSeats.length === 0}
          onPress={() => handleSubmitSelectedSeats()}>
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
  },
  backButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: THEME.cardBg,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.textWhite,
  },
  movieInfo: {
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 16,
    borderRadius: 16,
    backgroundColor: THEME.cardBg,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.textWhite,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  movieDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailValue: {
    fontSize: 13,
    color: THEME.textGray,
    fontWeight: '500',
  },
  screenContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  screen: {
    width: width * 0.8,
    height: 4,
    backgroundColor: THEME.primaryRed, // Screen line glow
    borderRadius: 4,
    marginBottom: 8,
    shadowColor: THEME.primaryRed,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  screenText: {
    fontSize: 10,
    color: THEME.textGray,
    letterSpacing: 4,
    fontWeight: 'bold',
  },
  seatsScrollView: {
    flex: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  seatsGrid: {
    paddingBottom: 10,
  },
  seatNumbers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    marginTop: 10,
    marginBottom: 20,
  },
  seatNumberText: {
    fontSize: 10,
    color: THEME.textGray,
    width: 22,
    textAlign: 'center',
  },
  legendContainer: {
      paddingHorizontal: 20,
      paddingVertical: 15,
      backgroundColor: THEME.cardBg,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '30%', // Grid layout
  },
  legendSeat: {
    width: 14,
    height: 14,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: THEME.textGray,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 30, // Safe area
    paddingTop: 15,
    backgroundColor: THEME.background,
    borderTopWidth: 1,
    borderTopColor: THEME.divider,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectionInfo: {
    flex: 1,
    marginRight: 10,
  },
  selectedSeatsText: {
    fontSize: 13,
    color: THEME.textWhite,
    marginBottom: 4,
    fontWeight: '600',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.primaryRed,
  },
  continueButton: {
    backgroundColor: THEME.primaryRed,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30, // Pill shape
    alignItems: 'center',
    shadowColor: THEME.primaryRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: THEME.cardBg,
    opacity: 0.5,
    shadowOpacity: 0,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default SeatSelectionScreen;