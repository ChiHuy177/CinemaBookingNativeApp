import React from 'react';
import {MyTicketProps} from '../types/ticket';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from 'react-native-paper';
import {colors} from '../constants/colors';
import dayjs from 'dayjs';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../navigation/StackParamList';

export const TicketCard = React.memo(
  ({
    ticket,
    navigation,
  }: {
    ticket: MyTicketProps;
    navigation: NativeStackNavigationProp<
      HomeStackParamList,
      'MyTicketsScreen'
    >;
  }) => {
    return (
      <Pressable
        onPress={() =>
          navigation.navigate('TicketDetailScreen', {
            ticketId: ticket.ticketId,
            isFromBooking: false,
          })
        }>
        <View style={styles.ticketCard}>
          <Text style={styles.movieTitle}>{ticket.movie.title}</Text>
          <View style={styles.dateTimeContainer}>
            <Icon
              source="calendar-outline"
              size={16}
              color={colors.lightGray}
            />
            <Text style={styles.dateTimeText}>
              {dayjs(ticket?.showingTime.startTime).format(
                'YYYY/MM/DD - HH:mm:ss',
              )}
            </Text>
          </View>

          <View style={styles.cinemaContainer}>
            <Icon source="map-marker" size={16} color={colors.lightGray} />
            <Text style={styles.cinemaText}>{ticket.cinemaName}</Text>
          </View>

          <View style={styles.priceContainer}>
            <View style={styles.priceSection}>
              <Text style={styles.priceLabel}>Total Price:</Text>
              <Text style={styles.priceValue}>
                {ticket.totalPrice.toLocaleString('vi-VN') + 'đ'}
              </Text>
            </View>
            <View style={styles.pointsSection}>
              <Icon source="star" size={16} color={colors.primary} />
              <Text style={styles.pointsText}>
                +{Math.round(ticket.totalPrice / 100)} points
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.reviewButton}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('MovieDetailScreen', {
                movieId: ticket.movie.movieId,
              })
            }>
            <Icon source="comment" size={16} color={colors.white} />
            <Text style={styles.reviewButtonText}>Review</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  ticketCard: {
    backgroundColor: colors.mediumGray,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 12,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateTimeText: {
    fontSize: 14,
    color: colors.lightGray,
    marginLeft: 8,
  },
  cinemaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cinemaText: {
    fontSize: 14,
    color: colors.lightGray,
    marginLeft: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  priceSection: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: colors.lightGray,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  pointsSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 4,
    fontWeight: '600',
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  reviewButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
    marginLeft: 8,
  },
});
