/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect, useCallback } from "react";
import { Platform, UIManager, LayoutAnimation, SafeAreaView, View, TouchableOpacity, Text, ScrollView, StyleSheet, StatusBar } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons'; 
import { CityItem } from "../components/CityItem";
import { useSpinner } from "../context/SpinnerContext";
import { getAllCinemasForBooking } from "../services/CinemaService";
import { CityData } from "../types/cinema";
import { CinemaListScreenProps } from "../types/screentypes";
import { showToast, checkErrorFetchingData } from "../utils/function";

// THEME COLORS EXTRACTED FROM IMAGE
const COLORS = {
  background: '#0B0F19', // Deep dark blue/black background
  card: '#1D212E', // Slightly lighter for buttons/cards
  primary: '#F54B46', // Coral red
  text: '#FFFFFF',
  textSecondary: '#7B8299', // Muted text color
};

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
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Header Area styled like the ChangePasswordScreen */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color={COLORS.text} />
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
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center', // Aligns vertically
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 10,
    // Removed borderBottomWidth to match the clean dark theme
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.card, // Square button style like in image
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {
    width: 40, // Match back button width for perfect centering
  },
  headerTitle: {
    fontSize: 20, // Adjusted size
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '400',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 32,
  },
});

export default CinemaListScreen;