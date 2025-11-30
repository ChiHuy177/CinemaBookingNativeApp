/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useMemo, useState} from 'react';
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
  // Platform,
} from 'react-native';
import {MovieTicketScreenProps} from '../types/screentypes';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; // Switched to Ionicons

// Components & Services
import ModalCoupon from '../components/ModalCoupon';
import ModalPoint from '../components/ModalPoints';
import {useSpinner} from '../context/SpinnerContext';
import {getClientRank} from '../services/RankService';
import {addTicket} from '../services/TicketService';
import {CouponProps} from '../types/coupon';
import {ClientRankProps} from '../types/rank';
import {CreateTicketProps} from '../types/ticket';
import {
  showToast,
  checkErrorFetchingData,
  getPosterImage,
  getComboImgae,
} from '../utils/function';
import {getEmailAndToken} from '../utils/storage';

const {width} = Dimensions.get('window');

// --- CINEMATIC DARK THEME CONFIGURATION ---
const THEME = {
  background: '#10111D', // Deep Cinematic Blue/Black
  cardBg: '#1C1D2E', // Slightly lighter panel
  primaryRed: '#FF3B30', // Neon/Cinematic Red
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
  const {seatParam, selectedCombos, totalPriceCombos} = route.params;
  const {selectedSeats, showingTimeParam, totalPriceSeats} = useMemo(() => {
    return seatParam;
  }, [seatParam]);

  const {cinemaName, date, movieParam, showingTimeId, time} = useMemo(() => {
    return showingTimeParam;
  }, [showingTimeParam]);

  const {movieId, movieTitle, poster} = useMemo(() => {
    return movieParam;
  }, [movieParam]);

  const [couponModalVisible, setCouponModalVisible] = useState<boolean>(false);
  const [pointsModalVisible, setPointsModalVisible] = useState<boolean>(false);
  const [rank, setRank] = useState<ClientRankProps | null>(null);
  const [coupon, setCoupon] = useState<CouponProps | null>(null);
  const [usedPoints, setUsedPoints] = useState<number>(0);
  const [slideAnim] = useState(new Animated.Value(width));
  const [clientEmail, setClientEmail] = useState<string>('');
  const {showSpinner, hideSpinner} = useSpinner();

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
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={THEME.background} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.glassButton}>
          <Icon name="chevron-back" size={24} color={THEME.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Summary</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 40}}>
        
        {/* Movie Info Card */}
        <View style={styles.movieCard}>
          <Image
            source={{uri: getPosterImage(poster)}}
            style={styles.movieImage}
            resizeMode="cover"
          />
          <View style={styles.movieInfo}>
            <Text
              style={styles.movieTitle}
              ellipsizeMode="tail"
              numberOfLines={2}>
              {movieTitle}
            </Text>
            
            <View style={styles.infoRow}>
              <Icon name="location-outline" size={14} color={THEME.primaryRed} />
              <Text style={styles.infoText}>{cinemaName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="calendar-outline" size={14} color={THEME.textGray} />
              <Text style={styles.infoText}>{date}</Text>
            </View>
            <View style={styles.infoRow}>
              <Icon name="time-outline" size={14} color={THEME.textGray} />
              <Text style={styles.infoText}>{time}</Text>
            </View>
          </View>
        </View>

        {/* Seats Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Selected Seats</Text>
          <View style={styles.itemCard}>
            <View style={styles.iconCircle}>
                <Icon name="grid-outline" size={20} color={THEME.textWhite} />
            </View>
            <Text style={styles.itemText}>
              {selectedSeats
                .map(
                  eachSelectedSeat =>
                    eachSelectedSeat.row + eachSelectedSeat.column,
                )
                .join(', ')}
            </Text>
            <Text style={styles.priceText}>
              {totalPriceSeats.toLocaleString('vi-VN')} đ
            </Text>
          </View>
        </View>

        {/* Combos Section */}
        {selectedCombos.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionHeader}>Snacks & Drinks</Text>
            {selectedCombos.map(eachCombo => (
              <View key={eachCombo.combo.comboId} style={styles.comboItem}>
                <Image
                  source={{uri: getComboImgae(eachCombo.combo.imageURL)}}
                  style={styles.comboImage}
                />
                <View style={styles.comboDetails}>
                  <Text style={styles.comboName}>{eachCombo.combo.name}</Text>
                  <Text style={styles.comboQty}>
                    x{eachCombo.quantity}
                  </Text>
                </View>
                <Text style={styles.priceText}>
                  {(eachCombo.quantity * eachCombo.combo.price).toLocaleString(
                    'vi-VN',
                  )}{' '}
                  đ
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Offers & Promotions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeader}>Offers & Discounts</Text>

          {/* Coupon Button */}
          <TouchableOpacity
            style={styles.offerButton}
            onPress={() => showModal('coupon')}
            activeOpacity={0.7}>
            <View style={[styles.iconCircle, {backgroundColor: 'rgba(255, 59, 48, 0.1)'}]}>
                <Icon name="ticket-outline" size={20} color={THEME.primaryRed} />
            </View>
            <View style={styles.offerContent}>
                <Text style={styles.offerTitle}>
                    {coupon ? `Applied: ${coupon.code}` : 'Select Coupon'}
                </Text>
                <Text style={styles.offerSubtitle}>
                    {coupon ? 'Discount applied' : 'Apply voucher code'}
                </Text>
            </View>
            <View style={styles.offerRight}>
              {coupon && (
                <Text style={styles.discountBadge}>
                  -{coupon?.discountAmount.toLocaleString('vi-VN')} đ
                </Text>
              )}
              <Icon name="chevron-forward" size={18} color={THEME.textGray} />
            </View>
          </TouchableOpacity>

          {/* Points Button */}
          <TouchableOpacity
            style={styles.offerButton}
            onPress={() => showModal('points')}
            activeOpacity={0.7}>
             <View style={[styles.iconCircle, {backgroundColor: 'rgba(255, 215, 0, 0.1)'}]}>
                <Icon name="star-outline" size={20} color="#FFD700" />
            </View>
            <View style={styles.offerContent}>
                <Text style={styles.offerTitle}>
                    {usedPoints > 0
                        ? `Redeemed: ${usedPoints}`
                        : 'Redeem Loyalty Points'}
                </Text>
                <Text style={styles.offerSubtitle}>
                    {usedPoints > 0 ? 'Points used' : 'Use points for discount'}
                </Text>
            </View>
            <View style={styles.offerRight}>
              {usedPoints > 0 && (
                <Text style={styles.discountBadge}>
                  -{usedPoints.toLocaleString('vi-VN')} đ
                </Text>
              )}
              <Icon name="chevron-forward" size={18} color={THEME.textGray} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Payment Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionHeader}>Payment Details</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              {subTotal.toLocaleString('vi-VN')} đ
            </Text>
          </View>

          {coupon && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Coupon Discount</Text>
              <Text style={styles.discountValue}>
                -{coupon.discountAmount.toLocaleString('vi-VN')} đ
              </Text>
            </View>
          )}

          {usedPoints > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Points Redeemed</Text>
              <Text style={styles.discountValue}>
                -{usedPoints.toLocaleString('vi-VN')} đ
              </Text>
            </View>
          )}

          {rank && rank.discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Member Rank ({rank.discount}%)
              </Text>
              <Text style={styles.discountValue}>
                -{totalRankDiscount.toLocaleString('vi-VN')} đ
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <View style={{alignItems: 'flex-end'}}>
                <Text style={styles.totalValue}>
                {totalPrice.toLocaleString('vi-VN')} đ
                </Text>
                <Text style={styles.vatText}>(VAT Included)</Text>
            </View>
          </View>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          style={styles.confirmButton}
          activeOpacity={0.8}
          onPress={() => handleBooking()}>
          <Text style={styles.confirmButtonText}>Confirm Payment</Text>
          <View style={styles.btnGlow} />
        </TouchableOpacity>
      </ScrollView>

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    marginBottom: 10,
  },
  glassButton: {
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
    fontSize: 18,
    fontWeight: '700',
    color: THEME.textWhite,
    letterSpacing: 0.5,
  },

  // Movie Card
  movieCard: {
    flexDirection: 'row',
    backgroundColor: THEME.cardBg,
    borderRadius: 16,
    padding: 12,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  movieImage: {
    width: 80,
    height: 110,
    borderRadius: 12,
    backgroundColor: '#000',
  },
  movieInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.textWhite,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: THEME.textGray,
    marginLeft: 6,
    fontWeight: '500',
  },

  // Sections
  sectionContainer: {
    marginBottom: 25,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.textDarkGray,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  
  // Seat Item
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.cardBg,
    padding: 15,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  iconCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(255,255,255,0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
  },
  itemText: {
    flex: 1,
    color: THEME.textWhite,
    fontSize: 15,
    fontWeight: '600',
  },
  priceText: {
    color: THEME.primaryRed,
    fontSize: 15,
    fontWeight: '700',
  },

  // Combo Item
  comboItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.cardBg,
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  comboImage: {
    width: 48,
    height: 48,
    borderRadius: 10,
    marginRight: 12,
  },
  comboDetails: {
    flex: 1,
  },
  comboName: {
    color: THEME.textWhite,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  comboQty: {
    color: THEME.textGray,
    fontSize: 12,
  },

  // Offer Buttons
  offerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.cardBg,
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  offerContent: {
      flex: 1,
  },
  offerTitle: {
      color: THEME.textWhite,
      fontSize: 14,
      fontWeight: '600',
  },
  offerSubtitle: {
      color: THEME.textGray,
      fontSize: 11,
      marginTop: 2,
  },
  offerRight: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  discountBadge: {
      color: THEME.successGreen,
      fontSize: 13,
      fontWeight: '600',
      marginRight: 5,
  },

  // Summary
  summaryContainer: {
      backgroundColor: THEME.cardBg,
      borderRadius: 20,
      padding: 20,
      marginBottom: 30,
      borderWidth: 1,
      borderColor: THEME.border,
  },
  summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
  },
  summaryLabel: {
      color: THEME.textGray,
      fontSize: 14,
  },
  summaryValue: {
      color: THEME.textWhite,
      fontSize: 14,
      fontWeight: '600',
  },
  discountValue: {
      color: THEME.successGreen,
      fontSize: 14,
      fontWeight: '600',
  },
  divider: {
      height: 1,
      backgroundColor: 'rgba(255,255,255,0.1)',
      marginVertical: 12,
      borderStyle: 'dashed',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)', // Dashed trick
  },
  totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 5,
  },
  totalLabel: {
      color: THEME.textWhite,
      fontSize: 16,
      fontWeight: 'bold',
  },
  totalValue: {
      color: THEME.primaryRed,
      fontSize: 22,
      fontWeight: '800',
      textShadowColor: 'rgba(255, 59, 48, 0.3)',
      textShadowOffset: {width: 0, height: 0},
      textShadowRadius: 10,
  },
  vatText: {
      color: THEME.textDarkGray,
      fontSize: 10,
      marginTop: 2,
  },

  // Payment Button
  confirmButton: {
    backgroundColor: THEME.primaryRed,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: THEME.primaryRed,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  btnGlow: {
      position: 'absolute',
      top: -10,
      left: 20,
      width: 50,
      height: 100,
      backgroundColor: 'rgba(255,255,255,0.1)',
      transform: [{rotate: '20deg'}],
  }
});

export default MovieTicketScreen;