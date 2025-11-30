import React from 'react';
import {ShowingTimeInRoomProps} from '../types/showingTime';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import { formatDateToHourseAndMinutes } from '../utils/function';


export const ShowingTimeButtonForBooking = React.memo(
  ({
    showingTime,
    isSelected,
    onPress,
  }: {
    showingTime: ShowingTimeInRoomProps;
    isSelected: boolean;
    onPress: () => void;
  }) => {
    const formattedTime = () => {
      return formatDateToHourseAndMinutes(new Date(showingTime.startTime));
    };

    return (
      <TouchableOpacity
        style={[styles.timeButton, isSelected && styles.selectedTimeButton]}
        onPress={onPress}
        activeOpacity={0.7}
        key={showingTime.showingTimeId}>
        <Text style={[styles.timeText, isSelected && styles.selectedTimeText]}>
          {formattedTime()}
        </Text>
      </TouchableOpacity>
    );
  },
);
const styles = StyleSheet.create({
  timeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#1F2130', // Card background matching HomeScreen
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  selectedTimeButton: {
    backgroundColor: '#FF3B30', // Accent color matching HomeScreen
  },
  timeText: {
    fontSize: 14,
    color: '#8F90A6', // Text gray matching HomeScreen
    fontWeight: '500',
  },
  selectedTimeText: {
    color: '#fff',
  },
});
