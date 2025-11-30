import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {DateInBookingProps} from '../types/date';
import React from 'react';

export const DateButtonForBooking = React.memo(
  ({
    date,
    isSelected,
    isToday,
    onPress,
  }: {
    date: DateInBookingProps;
    isSelected: boolean;
    isToday: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.dateButton, isSelected && styles.selectedDateButton]}
      onPress={onPress}
      key={date.dateKey}>
      <Text style={[styles.dayName, isSelected && styles.selectedDateText]}>
        {isToday ? 'Today' : date.dayName}
      </Text>
      <Text style={[styles.dayNumber, isSelected && styles.selectedDateText]}>
        {date.day}
      </Text>
      <Text style={[styles.monthText, isSelected && styles.selectedDateText]}>
        {date.month}
      </Text>
    </TouchableOpacity>
  ),
);

const styles = StyleSheet.create({
  dateButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 12,
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    minWidth: 60,
  },
  selectedDateButton: {
    backgroundColor: '#FF6B35',
  },
  dayName: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  monthText: {
    fontSize: 12,
    color: '#999',
  },
  selectedDateText: {
    color: '#fff',
  },
});
