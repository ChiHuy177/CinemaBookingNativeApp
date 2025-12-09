/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import { MovieTicketScreenProps } from '../types/screentypes';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

// Components & Services
import ModalCoupon from '../components/ModalCoupon';
import ModalPoint from '../components/ModalPoints';
import { useSpinner } from '../context/SpinnerContext';
import { getClientRank } from '../services/RankService';
import { addTicket } from '../services/TicketService';
import { CouponProps } from '../types/coupon';
import { ClientRankProps } from '../types/rank';
import { CreateTicketProps } from '../types/ticket';
import {
  showToast,
  checkErrorFetchingData,
  getPosterImage,
  getComboImgae,
} from '../utils/function';
import { getEmailAndToken } from '../utils/storage';

const { width } = Dimensions.get('window');

// THEME CONFIGURATION
const THEME = {
  background: '#10111D',
  cardBg: '#1C1D2E',
  primaryRed: '#F74346',
  textWhite: '#FFFFFF',
  textGray: '#A0A0B0',
  textDarkGray: '#5C5D6F',
  glass: 'rgba(255, 255, 255, 0.08)',
  border: 'rgba(255, 255, 255, 0.05)',
  successGreen: '#34C759',
};

const MovieTicketScreen: React.FC<MovieTicketScreenProps> = ({
  route,
  navigation,
}) => {
  const { seatParam, selectedCombos, totalPriceCombos } = route.params;
  const { selectedSeats, showingTimeParam, totalPriceSeats } = useMemo(() => {
    return seatParam;
  }, [seatParam]);

  const { cinemaName, date, movieParam, showingTimeId, time } = useMemo(() => {
    return showingTimeParam;
  }, [showingTimeParam]);

  const { movieId, movieTitle, poster } = useMemo(() => {
    return movieParam;
  }, [movieParam]);

  const [couponModalVisible, setCouponModalVisible] = useState<boolean>(false);
  const [pointsModalVisible, setPointsModalVisible] = useState<boolean>(false);
  const [rank, setRank] = useState<ClientRankProps | null>(null);
  const [coupon, setCoupon] = useState<CouponProps | null>(null);
  const [usedPoints, setUsedPoints] = useState<number>(0);
  const [slideAnim] = useState(new Animated.Value(width));
  const [clientEmail, setClientEmail] = useState<string>('');
  const { showSpinner, hideSpinner } = useSpinner();

  const subTotal = useMemo(() => {
    return totalPriceCombos + totalPriceSeats;
  }, [totalPriceCombos, totalPriceSeats]);

  const totalWithOutRank = useMemo(() => {
    return subTotal - (coupon?.discountAmount || 0);
  }, [subTotal, coupon]);

  const totalRankDiscount = useMemo(() => {
    return totalWithOutRank * ((rank?.discount || 0) / 100);
  }, [totalWithOutRank, rank]);

  const totalPrice = useMemo(() => {
    return totalWithOutRank - totalRankDiscount - usedPoints;
  }, [usedPoints, totalRankDiscount, totalWithOutRank]);

  const showModal = useCallback(
    (modalType: string) => {
      if (modalType === 'coupon') {
        setCouponModalVisible(true);
      } else {
        setPointsModalVisible(true);
      }

      slideAnim.setValue(width);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    },
    [slideAnim],
  );

  const hideModal = useCallback(() => {
    Animated.timing(slideAnim, {
      toValue: width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setCouponModalVisible(false);
      setPointsModalVisible(false);
    });
  }, [slideAnim]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchEmail = async () => {
        const auth = await getEmailAndToken();
        if (isActive) {
          setClientEmail(auth?.email || '');

          const responseData = await getClientRank(auth?.email || '');
          setRank(responseData.result);
        }
      };
      fetchEmail();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const handleBooking = useCallback(async () => {
    try {
      showSpinner();

      const ticket: CreateTicketProps = {
        cinemaName,
        clientEmail,
        couponId: coupon?.couponId || null,
        movieId,
        totalPrice,
        totalPriceCombos,
        totalPriceDiscount:
          (coupon?.discountAmount || 0) + usedPoints + totalRankDiscount,
        totalRankDiscount,
        totalPriceSeats,
        loyalPointsUsed: usedPoints,
        seatIds: selectedSeats.map(eachSelectedSeat => eachSelectedSeat.seatId),
        combos: selectedCombos.map(eachSelectedCombo => ({
          comboId: eachSelectedCombo.combo.comboId,
          quantity: eachSelectedCombo.quantity,
          name: eachSelectedCombo.combo.name,
        })),
        showingTimeId,
        movieTitle,
      };

      const responseData = await addTicket(ticket);
      if (responseData.code === 1000) {
        const unavailableSeats = responseData.result.unavailableSeats;
        const uavailableCombos = responseData.result.unavailableCombos;
        if (uavailableCombos.length > 0 || unavailableSeats.length > 0) {
          const seatError = unavailableSeats
            .map(eachSeat => eachSeat.row + eachSeat.column)
            .join(', ');

          const comboError = uavailableCombos
            .map(eachCombo => eachCombo.name)
            .join(', ');

          showToast({
            type: 'error',
            text1: `${
              unavailableSeats.length > 0
                ? `Unavailable Seats : ${seatError}\n`
                : ''
            } ${
              uavailableCombos.length > 0
                ? `Unavailable Snacks : ${comboError}`
                : ''
            }`,
          });
        } else {
          showToast({
            type: 'success',
            text1: 'Booking Successful!',
          });
          navigation.navigate('TicketDetailScreen', {
            ticketId: responseData.result.ticketId,
            isFromBooking: true,
          });
        }
      } else {
        showToast({
          type: 'error',
          text1: responseData.message,
        });
      }
    } catch (error) {
      checkErrorFetchingData({
        error: error,
        title: 'Booking Error',
      });
    } finally {
      hideSpinner();
    }
  }, [
    rank,
    clientEmail,
    date,
    time,
    coupon,
    totalPrice,
    totalPriceCombos,
    selectedSeats,
    selectedCombos,
    totalRankDiscount,
    totalWithOutRank,
    usedPoints,
    totalPriceSeats,
    totalRankDiscount,
  ]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={THEME.background} barStyle="light-content" />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="chevron-back" size={24} color={THEME.textWhite} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Movie Hero Card */}
          <View style={styles.heroCard}>
            <Image
              source={{ uri: getPosterImage(poster) }}
              style={styles.heroPoster}
              resizeMode="cover"
              blurRadius={8}
            />
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              <View style={styles.posterWrapper}>
                <Image
                  source={{ uri: getPosterImage(poster) }}
                  style={styles.posterImage}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.heroInfo}>
                <Text style={styles.heroTitle} numberOfLines={2}>
                  {movieTitle}
                </Text>
                <View style={styles.heroDetails}>
                  <View style={styles.heroDetailRow}>
                    <Icon name="location" size={14} color={THEME.primaryRed} />
                    <Text style={styles.heroDetailText}>{cinemaName}</Text>
                  </View>
                  <View style={styles.heroDetailRow}>
                    <Icon name="calendar" size={14} color={THEME.textGray} />
                    <Text style={styles.heroDetailText}>{date}</Text>
                  </View>
                  <View style={styles.heroDetailRow}>
                    <Icon name="time" size={14} color={THEME.textGray} />
                    <Text style={styles.heroDetailText}>{time}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Order Items */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Order</Text>

            {/* Seats */}
            <View style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <View style={styles.orderIconWrapper}>
                  <Icon name="apps" size={20} color={THEME.primaryRed} />
                </View>
                <Text style={styles.orderTitle}>Seats</Text>
              </View>
              <View style={styles.orderContent}>
                <Text style={styles.seatList}>
                  {selectedSeats.map(seat => seat.row + seat.column).join(', ')}
                </Text>
                <Text style={styles.orderPrice}>
                  {totalPriceSeats.toLocaleString('vi-VN')} đ
                </Text>
              </View>
            </View>

            {/* Combos */}
            {selectedCombos.length > 0 && (
              <View style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View style={styles.orderIconWrapper}>
                    <Icon name="fast-food" size={20} color="#FF9500" />
                  </View>
                  <Text style={styles.orderTitle}>Food & Drinks</Text>
                </View>
                {selectedCombos.map(combo => (
                  <View key={combo.combo.comboId} style={styles.comboRow}>
                    <Image
                      source={{ uri: getComboImgae(combo.combo.imageURL) }}
                      style={styles.comboThumb}
                    />
                    <View style={styles.comboInfo}>
                      <Text style={styles.comboName}>{combo.combo.name}</Text>
                      <Text style={styles.comboQty}>Qty: {combo.quantity}</Text>
                    </View>
                    <Text style={styles.comboPrice}>
                      {(combo.quantity * combo.combo.price).toLocaleString(
                        'vi-VN',
                      )}{' '}
                      đ
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Discounts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Apply Discounts</Text>

            {/* Coupon */}
            <TouchableOpacity
              style={styles.discountCard}
              onPress={() => showModal('coupon')}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.discountIcon,
                  { backgroundColor: 'rgba(247, 67, 70, 0.12)' },
                ]}
              >
                <Icon name="pricetag" size={22} color={THEME.primaryRed} />
              </View>
              <View style={styles.discountContent}>
                <Text style={styles.discountTitle}>
                  {coupon ? coupon.code : 'Apply Coupon'}
                </Text>
                <Text style={styles.discountSubtitle}>
                  {coupon
                    ? `Save ${coupon.discountAmount.toLocaleString('vi-VN')} đ`
                    : 'Get discount with voucher'}
                </Text>
              </View>
              {coupon ? (
                <View style={styles.appliedBadge}>
                  <Icon
                    name="checkmark-circle"
                    size={20}
                    color={THEME.successGreen}
                  />
                </View>
              ) : (
                <Icon name="chevron-forward" size={20} color={THEME.textGray} />
              )}
            </TouchableOpacity>

            {/* Points */}
            <TouchableOpacity
              style={styles.discountCard}
              onPress={() => showModal('points')}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.discountIcon,
                  { backgroundColor: 'rgba(255, 215, 0, 0.12)' },
                ]}
              >
                <Icon name="star" size={22} color="#FFD700" />
              </View>
              <View style={styles.discountContent}>
                <Text style={styles.discountTitle}>
                  {usedPoints > 0 ? `${usedPoints} Points` : 'Redeem Points'}
                </Text>
                <Text style={styles.discountSubtitle}>
                  {usedPoints > 0
                    ? `Save ${usedPoints.toLocaleString('vi-VN')} đ`
                    : 'Use loyalty points'}
                </Text>
              </View>
              {usedPoints > 0 ? (
                <View style={styles.appliedBadge}>
                  <Icon
                    name="checkmark-circle"
                    size={20}
                    color={THEME.successGreen}
                  />
                </View>
              ) : (
                <Icon name="chevron-forward" size={20} color={THEME.textGray} />
              )}
            </TouchableOpacity>
          </View>

          {/* Price Breakdown */}
          <View style={styles.breakdownCard}>
            <Text style={styles.breakdownTitle}>Price Breakdown</Text>

            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Subtotal</Text>
              <Text style={styles.breakdownValue}>
                {subTotal.toLocaleString('vi-VN')} đ
              </Text>
            </View>

            {coupon && (
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Coupon Discount</Text>
                <Text style={styles.breakdownDiscount}>
                  -{coupon.discountAmount.toLocaleString('vi-VN')} đ
                </Text>
              </View>
            )}

            {usedPoints > 0 && (
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>Points Redeemed</Text>
                <Text style={styles.breakdownDiscount}>
                  -{usedPoints.toLocaleString('vi-VN')} đ
                </Text>
              </View>
            )}

            {rank && rank.discount > 0 && (
              <View style={styles.breakdownRow}>
                <Text style={styles.breakdownLabel}>
                  Member Discount ({rank.discount}%)
                </Text>
                <Text style={styles.breakdownDiscount}>
                  -{totalRankDiscount.toLocaleString('vi-VN')} đ
                </Text>
              </View>
            )}

            <View style={styles.breakdownDivider} />

            <View style={styles.totalRow}>
              <View>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.vatText}>Taxes included</Text>
              </View>
              <Text style={styles.totalValue}>
                {totalPrice.toLocaleString('vi-VN')} đ
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Checkout Button */}
        <View style={styles.bottomBar}>
          <View style={styles.bottomTotal}>
            <Text style={styles.bottomTotalLabel}>Total</Text>
            <Text style={styles.bottomTotalValue}>
              {totalPrice.toLocaleString('vi-VN')} đ
            </Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutButton}
            activeOpacity={0.9}
            onPress={handleBooking}
          >
            <Text style={styles.checkoutButtonText}>Confirm & Pay</Text>
            <Icon name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Modals */}
      <ModalCoupon
        coupon={coupon}
        setCoupon={setCoupon}
        couponModalVisible={couponModalVisible}
        hideModal={hideModal}
        slideAnim={slideAnim}
      />

      <ModalPoint
        hideModal={hideModal}
        pointsModalVisible={pointsModalVisible}
        setUsedPoints={setUsedPoints}
        slideAnim={slideAnim}
        totalWithOutPoints={totalWithOutRank - totalRankDiscount}
        usedPoints={usedPoints}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.glass,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.border,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.textWhite,
  },

  // Hero Card
  heroCard: {
    height: 180,
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  heroPoster: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(16, 17, 29, 0.85)',
  },
  heroContent: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
  },
  posterWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  posterImage: {
    width: 90,
    height: 130,
    borderRadius: 12,
  },
  heroInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.textWhite,
    marginBottom: 12,
    lineHeight: 24,
  },
  heroDetails: {
    gap: 8,
  },
  heroDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroDetailText: {
    fontSize: 13,
    color: THEME.textGray,
    marginLeft: 8,
    fontWeight: '500',
  },

  // Sections
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.textWhite,
    marginBottom: 14,
  },

  // Order Cards
  orderCard: {
    backgroundColor: THEME.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(247, 67, 70, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  orderTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.textWhite,
  },
  orderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seatList: {
    flex: 1,
    fontSize: 14,
    color: THEME.textGray,
    fontWeight: '500',
  },
  orderPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.primaryRed,
  },

  // Combo Row
  comboRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
    marginTop: 8,
  },
  comboThumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    marginRight: 12,
  },
  comboInfo: {
    flex: 1,
  },
  comboName: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.textWhite,
    marginBottom: 2,
  },
  comboQty: {
    fontSize: 12,
    color: THEME.textGray,
  },
  comboPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.textWhite,
  },

  // Discount Cards
  discountCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.cardBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  discountIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  discountContent: {
    flex: 1,
  },
  discountTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.textWhite,
    marginBottom: 2,
  },
  discountSubtitle: {
    fontSize: 12,
    color: THEME.textGray,
  },
  appliedBadge: {
    marginLeft: 8,
  },

  // Breakdown Card
  breakdownCard: {
    backgroundColor: THEME.cardBg,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.textWhite,
    marginBottom: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  breakdownLabel: {
    fontSize: 14,
    color: THEME.textGray,
  },
  breakdownValue: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.textWhite,
  },
  breakdownDiscount: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.successGreen,
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: THEME.border,
    marginVertical: 14,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME.textWhite,
    marginBottom: 2,
  },
  vatText: {
    fontSize: 11,
    color: THEME.textDarkGray,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '800',
    color: THEME.primaryRed,
  },

  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: THEME.cardBg,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: THEME.border,
  },
  bottomTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  bottomTotalLabel: {
    fontSize: 14,
    color: THEME.textGray,
    fontWeight: '500',
  },
  bottomTotalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.textWhite,
  },
  checkoutButton: {
    backgroundColor: THEME.primaryRed,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 28,
    gap: 10,
    shadowColor: THEME.primaryRed,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  checkoutButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

export default MovieTicketScreen;
