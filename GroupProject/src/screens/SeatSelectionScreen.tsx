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
import { colors } from '../constant/color';
import { SeatRows } from '../constant/variable';
import { useSpinner } from '../context/SpinnerContext';
import { getSeatRowsForBooking } from '../services/SeatService';
import { SeatRowForBookingProps, SeatColumnForBookingProps } from '../types/seat';
import { showToast } from '../utils/function';

const {width} = Dimensions.get('window');

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
      <StatusBar barStyle="light-content" backgroundColor={colors.dark} />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Seats</Text>
      </View>
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle}>{movieParam.movieTitle}</Text>
        <View style={styles.movieDetails}>
          <View>
            <Text style={styles.detailLabel}>Cinema</Text>
            <Text style={styles.detailValue}>{cinemaName}</Text>
          </View>
          <View>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{date}</Text>
          </View>
          <View>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>{time}</Text>
          </View>
        </View>
      </View>
      <View style={styles.screenContainer}>
        <View style={styles.screen} />
        <Text style={styles.screenText}>SCREEN</Text>
      </View>
      <ScrollView
        style={styles.seatsScrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.seatsGrid}>{renderRows(handleSeatPress)}</View>

        <View style={styles.seatNumbers}>{coloumnsBase}</View>
      </ScrollView>
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendSeat, {backgroundColor: colors.primary}]}
          />
          <Text style={styles.legendText}>Selected</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendSeat, {backgroundColor: colors.lightGray}]}
          />
          <Text style={styles.legendText}>Normal</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, {backgroundColor: colors.green}]} />
          <Text style={styles.legendText}>VIP</Text>
        </View>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, {backgroundColor: colors.pink}]} />
          <Text style={styles.legendText}>Sweet Box</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendSeat, {backgroundColor: colors.gold}]} />
          <Text style={styles.legendText}>Gold</Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendSeat, {backgroundColor: colors.mediumGray}]}
          />
          <Text style={styles.legendText}>Taken</Text>
        </View>
      </View>
      <View style={styles.bottomSection}>
        <View style={styles.selectionInfo}>
          <Text style={styles.selectedSeatsText}>
            Selected Seats:
            {displaySelectedSeats}
          </Text>
          <Text style={styles.totalText}>
            Total: {totalPrice.toLocaleString('vi-VN') + 'đ'}
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
    backgroundColor: colors.dark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.mediumGray,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
  },
  movieInfo: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 10,
  },
  movieDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.lightGray,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '500',
  },
  screenContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  screen: {
    width: width * 0.7,
    height: 4,
    backgroundColor: colors.lightGray,
    borderRadius: 2,
    marginBottom: 8,
  },
  screenText: {
    fontSize: 12,
    color: colors.lightGray,
    letterSpacing: 2,
  },
  seatsScrollView: {
    flex: 1,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  seatsGrid: {
    paddingBottom: 10,
  },
  seatNumbers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    marginTop: 10,
  },
  seatNumberText: {
    fontSize: 12,
    color: colors.lightGray,
    width: 22,
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: colors.mediumGray,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendSeat: {
    width: 16,
    height: 16,
    borderRadius: 3,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: colors.lightGray,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: colors.mediumGray,
  },
  selectionInfo: {
    marginBottom: 15,
  },
  selectedSeatsText: {
    fontSize: 14,
    color: colors.white,
    marginBottom: 5,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: colors.mediumGray,
    opacity: 0.6,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
  },
});

export default SeatSelectionScreen;
