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
import Icon from 'react-native-vector-icons/Ionicons'; // Changed to Ionicons
import {ComboBookingScreenProps} from '../types/screentypes';

import {ComboItem} from '../components/ComboItem';
import {useFocusEffect} from '@react-navigation/native';
import { useSpinner } from '../context/SpinnerContext';
import { getCombos } from '../services/ComboService';
import { SelectedComboProps, ComboProps } from '../types/combo';
import { showToast, checkErrorFetchingData } from '../utils/function';

const {width} = Dimensions.get('window');

// THEME COLORS CONSISTENT WITH OTHER SCREENS
const COLORS = {
  background: '#0B0F19', // Deep dark blue/black background
  card: '#1D212E', // Slightly lighter for buttons/cards and summary bar
  primary: '#F54B46', // Coral red
  text: '#FFFFFF',
  textSecondary: '#7B8299', // Muted text color
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
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Consistent Header Style */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
           <Text style={styles.headerTitleText}>Combos</Text>
           <Text style={styles.headerSubtitle}>Snacks & Drinks</Text>
        </View>
        <View style={{width: 40}} /> {/* Placeholder */}
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
        <View style={{height: 120}} />
      </ScrollView>

      {/* Order Summary / Footer */}
      <View style={styles.orderSummary}>
        <View style={styles.summaryInfo}>
          <Text style={styles.summaryText}>Tổng đơn hàng ({totalQuantity} Combo + {selectedSeats.length} Ghế)</Text>
          
          <View style={styles.totalPriceSeatContainer}>
             {/* Total Grand Price */}
             <Text style={styles.grandTotalPrice}>
               {grandTotal.toLocaleString('vi-VN') + 'đ'}
             </Text>
             {/* Breakdown Text */}
             <Text style={styles.breakdownText}>
                ({totalPriceSeats.toLocaleString('vi-VN')}đ ghế + {totalPrice.toLocaleString('vi-VN')}đ combo)
             </Text>
          </View>
          
        </View>

        <TouchableOpacity
          style={[styles.bookingButton, {opacity: selectedSeats.length > 0 ? 1 : 0.5}]}
          onPress={handleBookingTicket}
          disabled={selectedSeats.length === 0}
          >
          <Text style={styles.bookingButtonText}>Tiếp tục</Text>
          <Icon name="arrow-forward-circle-outline" size={20} color={COLORS.text} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // --- Header Styles ---
  headerContainer: {
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
    borderRadius: 12,
    backgroundColor: COLORS.card, // Square button style
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
     flex: 1,
     alignItems: 'center',
  },
  headerTitleText: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  headerSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  // --- Scroll Content Styles ---
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  // --- Footer/Summary Styles ---
  orderSummary: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.card, // Dark card color for footer
    borderTopWidth: 0,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Improved shadow for modern look
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -5},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  totalPriceSeatContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  grandTotalPrice: {
    color: COLORS.primary, // Highlight total price
    fontSize: 24,
    fontWeight: '900',
  },
  breakdownText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  bookingButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12, // More rounded corners
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  bookingButtonText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ComboSelectionScreen;