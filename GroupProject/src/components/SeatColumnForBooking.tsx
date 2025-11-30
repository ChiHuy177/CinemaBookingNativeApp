import React from 'react';
import {SeatColumnForBookingProps} from '../types/seat';

import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import { getSeatColor } from '../constant/color';

export const SeatColumnForBooking = React.memo(
  ({
    seat,
    handleSelectSeat,
    row,
  }: {
    seat: SeatColumnForBookingProps;
    handleSelectSeat: (seat: SeatColumnForBookingProps, row: string) => void;
    row: string;
  }) => {
    const seatColor = getSeatColor(seat);
    const isDisabled = seat.status === 'taken' || seat.status === 'empty';

    return (
      <TouchableOpacity
        key={seat.seatId}
        style={[
          styles.seat,
          {backgroundColor: seatColor},
          isDisabled && styles.disabledSeat,
          seat.status === 'empty' && styles.seatStatusEmpty,
        ]}
        onPress={() => handleSelectSeat(seat, row)}
        disabled={isDisabled}
        activeOpacity={0.7}>
        <Text
          style={[
            styles.seatText,
            seat.status === 'selected' && styles.selectedSeatText,
            isDisabled && styles.disabledSeatText,
          ]}>
          {seat.status === 'empty' ? '' : seat.column}
        </Text>
      </TouchableOpacity>
    );
  },

  (prevProps, nextProps) => prevProps.seat.status === nextProps.seat.status,
);

const styles = StyleSheet.create({
  seat: {
    width: 22,
    height: 22,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 1,
  },
  seatText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.dark,
  },
  selectedSeatText: {
    color: colors.white,
  },
  disabledSeat: {
    opacity: 0.6,
  },
  disabledSeatText: {
    color: colors.dark,
  },
  seatStatusEmpty: {
    backgroundColor: 'transparent',
  },
});
