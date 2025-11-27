import React from 'react';
import {CinemaInCityProps} from '../types/cinema';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../navigation/StackParamList';
import { colors } from '../constant/color';

export const CinemaItem = React.memo(
  ({
    cinema,
    navigation,
  }: {
    cinema: CinemaInCityProps;
    navigation: NativeStackNavigationProp<
      HomeStackParamList,
      'CinemaListScreen'
    >;
  }) => (
    <Pressable
      onPress={() =>
        navigation.navigate('CinemaMoviesScreen', {
          cinemaId: cinema.cinemaId,
          cinemaName: cinema.name,
        })
      }>
      <View key={cinema.cinemaId} style={styles.cinemaItem}>
        <View style={styles.cinemaInfo}>
          <Text style={styles.cinemaName}>{cinema.name}</Text>
          <Text style={styles.cinemaAddress}>{cinema.address}</Text>
          <Text style={styles.cinemaHotline}>Hotline: {cinema.hotline}</Text>
        </View>
      </View>
    </Pressable>
  ),
);

const styles = StyleSheet.create({
  cinemaItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.mediumGray,
    backgroundColor: colors.dark,
  },
  cinemaInfo: {
    flex: 1,
  },
  cinemaName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    marginBottom: 6,
  },
  cinemaAddress: {
    fontSize: 14,
    color: colors.lightGray,
    marginBottom: 4,
    lineHeight: 20,
  },
  cinemaHotline: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
});
