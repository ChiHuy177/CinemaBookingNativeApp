/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect, useCallback } from "react";
import { Platform, UIManager, LayoutAnimation, SafeAreaView, View, TouchableOpacity, Text, ScrollView, StyleSheet } from "react-native";
import { Icon } from "react-native-paper";
import { CityItem } from "../components/CityItem";
import { colors } from "../constant/color";
import { useSpinner } from "../context/SpinnerContext";
import { getAllCinemasForBooking } from "../services/CinemaService";
import { CityData } from "../types/cinema";
import { CinemaListScreenProps } from "../types/screentypes";
import { showToast, checkErrorFetchingData } from "../utils/function";


if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const CinemaListScreen: React.FC<CinemaListScreenProps> = ({navigation}) => {
  const [expandedCities, setExpandedCities] = useState<Set<string>>(new Set());

  const [cities, setCities] = useState<CityData[]>([]);
  const {showSpinner, hideSpinner} = useSpinner();

  useEffect(() => {
    async function fetchCinemas() {
      try {
        showSpinner();
        const responseData = await getAllCinemasForBooking();
        if (responseData.code === 1000) {
          setCities(responseData.result);
        } else {
          showToast({
            type: 'error',
            text1: responseData.message,
          });
        }
      } catch (error) {
        checkErrorFetchingData({
          error: error,
          title: 'Error fetching cinemas',
        });
      } finally {
        hideSpinner();
      }
    }
    fetchCinemas();
  }, []);

  const toggleCity = useCallback((city: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setExpandedCities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(city)) {
        newSet.delete(city);
      } else {
        newSet.add(city);
      }
      return newSet;
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon source="chevron-left" size={30} color="white" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Cinemas</Text>
          <Text style={styles.headerSubtitle}>Choose city to pick cinema</Text>
        </View>

        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {cities.map(eachCity => (
          <CityItem
            cityData={eachCity}
            expandedCities={expandedCities}
            toggleCity={toggleCity}
            key={eachCity.city}
            navigation={navigation}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.mediumGray,
  },
  backButton: {
    paddingTop: 4,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {
    width: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.lightGray,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
});

export default CinemaListScreen;
