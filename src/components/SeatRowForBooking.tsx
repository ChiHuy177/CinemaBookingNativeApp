import React from 'react';
import {SeatColumnForBookingProps, SeatRowForBookingProps} from '../types/seat';
import {StyleSheet, Text, View} from 'react-native';
import {SeatColumnForBooking} from './SeatColumnForBooking';
import {colors} from '../constants/colors';
import {SeatColumns} from '../constants/variables';

export const SeatRowForBooking = React.memo(
  ({
    seatRow,
    handleSelectSeat,
  }: {
    seatRow: SeatRowForBookingProps;
    handleSelectSeat: (seat: SeatColumnForBookingProps, row: string) => void;
  }) => {
    let columnsSeat: SeatColumnForBookingProps[] = [];
    if (seatRow.seatColumns.length !== 14) {
      let indexColumnBase = 0;
      let indexColumnState = 0;
      while (
        indexColumnBase < SeatColumns.length &&
        indexColumnState < seatRow.seatColumns.length
      ) {
        if (
          SeatColumns[indexColumnBase] ===
          seatRow.seatColumns[indexColumnState].column
        ) {
          columnsSeat.push(seatRow.seatColumns[indexColumnState]);
          indexColumnState++;
        } else {
          columnsSeat.push({
            column: SeatColumns[indexColumnBase],
            seatId: -indexColumnBase,
            seatType: null,
            status: 'empty',
            row: seatRow.row,
          });
        }

        indexColumnBase++;
      }
    } else {
      columnsSeat = seatRow.seatColumns;
    }

    return (
      <View key={seatRow.row} style={styles.seatRow}>
        <Text style={styles.rowLabel}>{seatRow.row}</Text>
        <View style={styles.seatsContainer}>
          {columnsSeat.map(seat => (
            <SeatColumnForBooking
              handleSelectSeat={handleSelectSeat}
              row={seatRow.row}
              seat={seat}
              key={seat.seatId}
            />
          ))}
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  seatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rowLabel: {
    width: 20,
    fontSize: 14,
    color: colors.white,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  seatsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
});
