import React from 'react';
import {ShowingTimeInRoomProps} from '../types/showingTime';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {formatDateToHourseAndMinutes} from '../utils/functions';

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
    backgroundColor: '#3a3a3a',
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
  },
  selectedTimeButton: {
    backgroundColor: '#FF6B35',
  },
  timeText: {
    fontSize: 14,
    color: '#ccc',
    fontWeight: '500',
  },
  selectedTimeText: {
    color: '#fff',
  },
});
