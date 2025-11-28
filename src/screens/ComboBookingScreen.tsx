/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {ComboBookingScreenProps} from '../types/screentypes';

import {ComboItem} from '../components/ComboItem';
import {useFocusEffect} from '@react-navigation/native';
import { useSpinner } from '../context/SpinnerContext';
import { getCombos } from '../services/ComboService';
import { SelectedComboProps, ComboProps } from '../types/combo';
import { showToast, checkErrorFetchingData } from '../utils/function';

const {width} = Dimensions.get('window');

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

const ComboSelectionScreen: React.FC<ComboBookingScreenProps> = ({
  route,
  navigation,
}) => {
  const [selectedCombos, setSelectedCombos] = useState<SelectedComboProps[]>(
    [],
  );

  const {totalPriceSeats, selectedSeats} = route.params;
  const [combos, setCombos] = useState<ComboProps[]>([]);

  const {hideSpinner, showSpinner} = useSpinner();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      async function fetchingCombos() {
        try {
          showSpinner();
          const responseData = await getCombos();
          if (responseData.code === 1000 && isActive) {
            setCombos(responseData.result);
          } else {
            showToast({
              type: 'error',
              text1: responseData.message,
            });
          }
        } catch (error) {
          checkErrorFetchingData({
            error: error,
            title: 'Error fetching combos',
          });
        } finally {
          hideSpinner();
        }
      }

      fetchingCombos();
      return () => {
        isActive = false;
      };
    }, []),
  );

  const updateQuantity = useCallback(
    (selectedCombo: ComboProps, change: number) => {
      const isExist = selectedCombos.some(
        eachSelected => eachSelected.combo.comboId === selectedCombo.comboId,
      );
      if (!isExist && change === -1) {
        return;
      }

      if (!isExist) {
        setSelectedCombos(prev => [
          ...prev,
          {combo: selectedCombo, quantity: change},
        ]);
      } else {
        setSelectedCombos(prev =>
          prev
            .map(eachSelectedCombo =>
              eachSelectedCombo.combo.comboId === selectedCombo.comboId
                ? {
                    ...eachSelectedCombo,
                    quantity: eachSelectedCombo.quantity + change,
                  }
                : eachSelectedCombo,
            )
            .filter(eachSelectedCombo => eachSelectedCombo.quantity > 0),
        );
      }
    },
    [selectedCombos],
  );

  const {totalPrice, totalQuantity} = useMemo(() => {
    return selectedCombos.reduce(
      (acc, eachCombo) => {
        return {
          totalPrice:
            acc.totalPrice + eachCombo.combo.price * eachCombo.quantity,
          totalQuantity: acc.totalQuantity + eachCombo.quantity,
        };
      },
      {
        totalPrice: 0,
        totalQuantity: 0,
      },
    );
  }, [selectedCombos]);

  const handleBookingTicket = useCallback(() => {
    navigation.navigate('MovieTicketScreen', {
      seatParam: route.params,
      selectedCombos: selectedCombos,
      totalPriceCombos: totalPrice,
    });
  }, [selectedCombos, totalPrice, route.params, navigation]);

  const grandTotal = useMemo(() => totalPrice + totalPriceSeats, [totalPrice, totalPriceSeats]);
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.background} />
      
      {/* Decorative Glow */}
      <View style={styles.topGlow} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={THEME.textWhite} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
           <Text style={styles.headerTitle}>COMBOS</Text>
           <Text style={styles.headerSubtitle}>Snacks & Drinks</Text>
        </View>
        <View style={{width: 40}} /> 
      </View>


      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        <FlatList
          data={combos}
          renderItem={({item}) => (
            <ComboItem
              combo={item}
              selectedCombos={selectedCombos}
              updateQuantity={updateQuantity}
              key={item.comboId}
            />
          )}
          keyExtractor={item => item.comboId.toString()}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />

        {/* Padding for the summary bar at the bottom */}
        <View style={{height: 140}} />
      </ScrollView>

      {/* Order Summary / Footer */}
      <View style={styles.orderSummary}>
        <View style={styles.summaryInfo}>
          <Text style={styles.summaryText}>Order Total ({totalQuantity} Combos + {selectedSeats.length} Seats)</Text>
          
          <View style={styles.totalPriceSeatContainer}>
             <Text style={styles.grandTotalPrice}>
               {grandTotal.toLocaleString('vi-VN') + 'đ'}
             </Text>
             <Text style={styles.breakdownText}>
                ({totalPriceSeats.toLocaleString('vi-VN')}đ seats + {totalPrice.toLocaleString('vi-VN')}đ combos)
             </Text>
          </View>
          
        </View>

        <TouchableOpacity
          style={[styles.bookingButton, {opacity: selectedSeats.length > 0 ? 1 : 0.5}]}
          onPress={handleBookingTicket}
          disabled={selectedSeats.length === 0}
          >
          <Text style={styles.bookingButtonText}>Continue</Text>
          <Icon name="arrow-forward" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
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
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 10,
    width: width,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20, // Circular
    backgroundColor: 'rgba(255,255,255,0.1)', // Glassmorphism
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
     flex: 1,
     alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.textWhite,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  headerSubtitle: {
    color: THEME.textGray,
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  // Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  // Footer
  orderSummary: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1F2130', // Card Bg
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 30, // Extra padding for safety
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -10},
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  summaryInfo: {
    flex: 1,
    marginRight: 10,
  },
  summaryText: {
    color: THEME.textGray,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  totalPriceSeatContainer: {
    justifyContent: 'center',
  },
  grandTotalPrice: {
    color: THEME.accent,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 2,
  },
  breakdownText: {
    color: '#5C5E6F',
    fontSize: 11,
    fontWeight: '500',
  },
  bookingButton: {
    backgroundColor: THEME.accent,
    borderRadius: 25, // Pill shape
    paddingHorizontal: 24,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: THEME.accent,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  bookingButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ComboSelectionScreen;