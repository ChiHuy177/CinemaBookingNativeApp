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
    backgroundColor: '#1F2130', // Card background matching HomeScreen
    borderRadius: 12, // Increased border radius to match HomeScreen
    minWidth: 60,
  },
  selectedDateButton: {
    backgroundColor: '#FF3B30', // Accent color matching HomeScreen
  },
  dayName: {
    fontSize: 12,
    color: '#8F90A6', // Text gray matching HomeScreen
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
    color: '#8F90A6', // Text gray matching HomeScreen
  },
  selectedDateText: {
    color: '#fff',
  },
});
