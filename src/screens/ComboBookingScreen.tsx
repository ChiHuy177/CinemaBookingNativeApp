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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ComboBookingScreenProps} from '../types/screentypes';
import {colors} from '../constants/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ComboProps, SelectedComboProps} from '../types/combo';
import {useSpinner} from '../context/SpinnerContext';
import {checkErrorFetchingData, showToast} from '../utils/functions';
import {getCombos} from '../api/services/combo.service';
import {ComboItem} from '../components/ComboItem';
import {useFocusEffect} from '@react-navigation/native';

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
  }, [selectedCombos]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🍿 Combos</Text>
          <Text style={styles.headerSubtitle}>
            Enjoy movies with deliciouse combos
          </Text>
        </View>

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

        <View style={{height: totalQuantity > 0 ? 120 : 20}} />
      </ScrollView>

      <View style={styles.orderSummary}>
        <View style={styles.summaryInfo}>
          <Text style={styles.summaryText}>Tổng: {totalQuantity} combo</Text>

          <Text style={styles.summaryPrice}>
            {totalPrice.toLocaleString('vi-VN') + 'đ'}
          </Text>
          <View style={styles.totalPriceSeatContainer}>
            <Text style={styles.summaryPrice}>
              + {totalPriceSeats.toLocaleString('vi-VN') + 'đ'}
            </Text>
            <Text
              style={
                styles.totalPriceSeat
              }>{`( ${selectedSeats.length} Seats )`}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.bookingButton}
          onPress={handleBookingTicket}>
          <Icon name="shopping-cart" size={20} color={colors.white} />
          <Text style={styles.bookingButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  totalPriceSeatContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  totalPriceSeat: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scrollView: {
    flex: 1,
  },
  backButton: {
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    marginBottom: 20,
  },
  headerTitle: {
    color: colors.white,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    color: colors.lightGray,
    fontSize: 16,
    textAlign: 'center',
  },

  unavailableContainer: {
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.dark,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.red,
  },
  unavailableText: {
    color: colors.red,
    fontSize: 14,
  },
  selectedSection: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  selectedSectionTitle: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
  selectedComboItem: {
    flexDirection: 'row',
    backgroundColor: colors.mediumGray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  selectedComboImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  selectedComboInfo: {
    flex: 1,
  },
  selectedComboName: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  selectedComboQuantity: {
    color: colors.lightGray,
    fontSize: 14,
    marginBottom: 2,
  },
  selectedComboPrice: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    padding: 8,
  },
  orderSummary: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.mediumGray,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  summaryInfo: {
    flex: 1,
  },
  summaryText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryPrice: {
    color: colors.primary,
    fontSize: 22,
    fontWeight: 'bold',
  },
  bookingButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bookingButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ComboSelectionScreen;
