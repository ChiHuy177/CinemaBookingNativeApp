import React from 'react';
import {Text, View} from 'react-native';
import {ShowingTimeButtonForBooking} from './ShowingTimeButtonForBooking';
import {RoomInCinemaProps} from '../types/room';
import {ShowingTimeInRoomProps} from '../types/showingTime';
import {StyleSheet} from 'react-native';

export const RoomForBooking = React.memo(
  ({
    room,
    onShowingTimeChange,
    onCinemaNameChange,
    selectedTime,
    cinemaName,
  }: {
    room: RoomInCinemaProps;
    onShowingTimeChange: (showingTime: ShowingTimeInRoomProps) => void;
    onCinemaNameChange: (cinemaName: string) => void;
    selectedTime: ShowingTimeInRoomProps | null;
    cinemaName: string;
  }) => {
    const showingTimeButtons = () => {
      return room.showingTimes.map(showingTime => {
        const isSelected =
          selectedTime?.showingTimeId === showingTime.showingTimeId;

        return (
          <ShowingTimeButtonForBooking
            key={showingTime.showingTimeId}
            showingTime={showingTime}
            isSelected={isSelected}
            onPress={() => {
              onShowingTimeChange(showingTime);
              onCinemaNameChange(cinemaName);
            }}
          />
        );
      });
    };

    return (
      <View key={room.roomId}>
        <View style={styles.roomContainer}>
          <View style={styles.roomDetails}>
            <Text style={styles.roomName}>{room.name}</Text>
            <Text style={styles.roomType}>{room.roomType.name}</Text>
            <Text style={styles.roomCapacity}>
              {room.roomType.totalSeat} seats
            </Text>
          </View>
        </View>
        <View style={styles.timesContainer}>{showingTimeButtons()}</View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  roomContainer: {
    backgroundColor: '#3d3d3d',
    marginHorizontal: 15,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#ff8133',
  },
  roomDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 12,
  },
  roomName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  roomType: {
    color: '#ff8133',
    fontSize: 13,
    fontWeight: '500',
    backgroundColor: 'rgba(255, 129, 51, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  roomCapacity: {
    color: '#c5c5c5',
    fontSize: 13,
    fontWeight: '400',
  },
  timesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    paddingBottom: 15,
    gap: 10,
  },
});
