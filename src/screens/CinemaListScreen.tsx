/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect, useCallback } from "react";
import { Platform, UIManager, LayoutAnimation, SafeAreaView, View, TouchableOpacity, Text, ScrollView, StyleSheet, StatusBar, Dimensions } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons'; 
import { CityItem } from "../components/CityItem";
import { useSpinner } from "../context/SpinnerContext";
import { getAllCinemasForBooking } from "../services/CinemaService";
import { CityData } from "../types/cinema";
import { CinemaListScreenProps } from "../types/screentypes";
import { showToast, checkErrorFetchingData } from "../utils/function";

const { width } = Dimensions.get('window');

// THEME CONSTANTS MATCHING PREVIOUS SCREENS
const THEME = {
  background: '#10111D', // Dark cinematic background
  cardBg: '#1F2130',     // Input/Card background
  accent: '#FF3B30',     // Bright Red/Coral accent
  textWhite: '#FFFFFF',
  textGray: '#8F90A6',   // Muted gray
  textPlaceholder: '#5C5E6F',
  error: '#FF3B30',
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
      <StatusBar barStyle="light-content" backgroundColor={THEME.background} />
      
      {/* Decorative Glow */}
      <View style={styles.topGlow} />
      
      {/* Header Area styled like the ChangePasswordScreen */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={THEME.textWhite} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>CINEMAS</Text>
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
    backgroundColor: THEME.background,
  },
  topGlow: {
    position: 'absolute',
    top: -100,
    left: -50,
    width: width,
    height: 300,
    backgroundColor: THEME.accent,
    opacity: 0.05,
    borderRadius: 150,
    transform: [{ scaleX: 1.5 }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center', // Aligns vertically
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20, // Circular
    backgroundColor: 'rgba(255,255,255,0.1)', // Glassmorphism effect
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
    fontSize: 18,
    fontWeight: '800', // Extra bold
    color: THEME.textWhite,
    marginBottom: 4,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  headerSubtitle: {
    fontSize: 13,
    color: THEME.textGray,
    fontWeight: '500',
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