import React from 'react';
import {StyleSheet} from 'react-native';
import {Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../constants/colors';
import {CityData} from '../types/cinema';
import {CinemaItem} from './CinemaItem';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../navigation/StackParamList';

export const CityItem = React.memo(
  ({
    cityData,
    toggleCity,
    expandedCities,
    navigation,
  }: {
    cityData: CityData;
    toggleCity: (city: string) => void;
    expandedCities: Set<string>;
    navigation: NativeStackNavigationProp<
      HomeStackParamList,
      'CinemaListScreen'
    >;
  }) => {
    const isExpanded = expandedCities.has(cityData.city);

    return (
      <View key={cityData.city} style={styles.cityContainer}>
        <TouchableOpacity
          style={[styles.cityHeader, isExpanded && styles.cityHeaderExpanded]}
          onPress={() => toggleCity(cityData.city)}
          activeOpacity={0.7}>
          <View style={styles.cityInfo}>
            <Text style={styles.cityName}>{cityData.city}</Text>
            <Text style={styles.cinemaCount}>{cityData.count} cinemas</Text>
          </View>
          <View
            style={[styles.expandIcon, isExpanded && styles.expandIconRotated]}>
            <Text style={styles.expandIconText}>▼</Text>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.cinemaList}>
            {cityData.cinemas.map(eachCinema => (
              <CinemaItem
                key={eachCinema.cinemaId}
                cinema={eachCinema}
                navigation={navigation}
              />
            ))}
          </View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  cityContainer: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: colors.mediumGray,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.mediumGray,
  },
  cityHeaderExpanded: {
    borderBottomWidth: 1,
    borderBottomColor: colors.dark,
  },
  cityInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  cinemaCount: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  expandIcon: {
    padding: 8,
    transform: [{rotate: '0deg'}],
  },
  expandIconRotated: {
    transform: [{rotate: '180deg'}],
  },
  expandIconText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cinemaList: {
    backgroundColor: colors.dark,
    paddingTop: 8,
  },
});
