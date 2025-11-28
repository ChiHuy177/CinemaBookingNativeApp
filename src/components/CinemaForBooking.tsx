/* eslint-disable react-hooks/exhaustive-deps */
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {CinemaForBookingProps} from '../types/cinema';
import {ShowingTimeInRoomProps} from '../types/showingTime';
import {RoomForBooking} from './RoomForBooking';
import {Icon} from 'react-native-paper';
import React from 'react';

export const CinemaForBooking = React.memo(
  ({
    cinema,
    toggleCinemaExpansion,
    totalShowTimes,
    expandedCinemas,
    onShowingTimeChange,
    onCinemaNameChange,
    selectedTime,
  }: {
    cinema: CinemaForBookingProps;
    toggleCinemaExpansion: (cinemaName: string) => void;
    totalShowTimes: {
      [cinemaName: string]: number;
    };
    expandedCinemas: {
      [cinemaName: string]: boolean;
    };
    onShowingTimeChange: (showingTime: ShowingTimeInRoomProps) => void;
    onCinemaNameChange: (cinemaName: string) => void;
    selectedTime: ShowingTimeInRoomProps | null;
  }) => {
    const isExpanded = expandedCinemas[cinema.name];

    const renderedRooms = () => {
      if (!isExpanded) {
        return null;
      }

      return cinema.rooms.map(room => (
        <RoomForBooking
          onShowingTimeChange={onShowingTimeChange}
          onCinemaNameChange={onCinemaNameChange}
          room={room}
          selectedTime={selectedTime}
          key={room.roomId}
          cinemaName={cinema.name}
        />
      ));
    };

    return (
      <View style={styles.cinemaContainer} key={cinema.cinemaId}>
        <TouchableOpacity
          style={styles.cinemaHeader}
          onPress={() => toggleCinemaExpansion(cinema.name)}>
          <View style={styles.cinemaInfo}>
            <Text style={styles.cinemaName}>{cinema.name}</Text>
            <Text style={styles.showtimeCount}>
              {totalShowTimes[cinema.name]} showtimes
            </Text>
          </View>
          <Icon
            source={isExpanded ? 'chevron-down' : 'chevron-up'}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
        {renderedRooms()}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  cinemaContainer: {
    backgroundColor: '#1F2130', // Card background matching HomeScreen
    borderRadius: 12, // Increased border radius to match HomeScreen
    marginBottom: 15,
    overflow: 'hidden',
  },
  cinemaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  cinemaInfo: {
    flex: 1,
  },
  cinemaName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 4,
  },
  showtimeCount: {
    fontSize: 12,
    color: '#8F90A6', // Text gray matching HomeScreen
  },
});
