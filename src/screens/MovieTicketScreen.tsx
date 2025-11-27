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
} from 'react-native';
import {MovieTicketScreenProps} from '../types/screentypes';

import {SafeAreaView} from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Icon } from 'react-native-paper';
import ModalCoupon from '../components/ModalCoupon';
import ModalPoint from '../components/ModalPoints';
// import { colors } from '../constant/color'; // Replaced with local THEME
import { useSpinner } from '../context/SpinnerContext';
import { getClientRank } from '../services/RankService';
import { addTicket } from '../services/TicketService';
import { CouponProps } from '../types/coupon';
import { ClientRankProps } from '../types/rank';
import { CreateTicketProps } from '../types/ticket';
import { showToast, checkErrorFetchingData, getPosterImage, getComboImgae } from '../utils/function';
import { getEmailAndToken } from '../utils/storage';

const {width} = Dimensions.get('window');

// THEME CONSTANTS EXTRACTED FROM IMAGE
const THEME = {
  background: '#13141F', // Dark blue-black background
  primaryRed: '#F54B64', // Coral red
  cardBg: '#20212D',     // Slightly lighter for cards
  textWhite: '#FFFFFF',
  textGray: '#8F9BB3',   // Muted blue-gray text
  divider: 'rgba(255,255,255,0.08)',
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
                ? `Unavailable Combos : ${comboError}`
                : ''
            }`,
          });
        } else {
          showToast({
            type: 'success',
            text1: 'Booking Successfully!!',
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
        title: 'Error booking',
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

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon source="chevron-left" size={28} color={THEME.textWhite} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
                Ticket Information
            </Text>
            <View style={{width: 38}} />
        </View>

        {/* Movie Info Card */}
        <View
          style={styles.movieHeader}>
          <Image
            source={{uri: getPosterImage(poster)}}
            style={styles.movieImage}
            resizeMode="cover"
          />
          <View style={styles.movieInfo}>
            <Text
              style={styles.movieTitle}
              ellipsizeMode="tail"
              numberOfLines={3}>
              {movieTitle}
            </Text>
            <View style={styles.infoRow}>
              <Icon source="map-marker" size={16} color={THEME.textGray} />
              <Text style={styles.infoText}>
                {cinemaName}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Icon source="calendar" size={16} color={THEME.textGray} />
              <Text style={styles.infoText}>
                {date}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Icon source="clock" size={16} color={THEME.textGray} />
              <Text style={styles.infoText}>
                {time}
              </Text>
            </View>
          </View>
        </View>

        {/* Seats Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Selected Seats
          </Text>
          <View
            style={styles.seatContainer}>
            <Icon source="seat" size={20} color={THEME.primaryRed} />
            <Text style={styles.seatText}>
              {selectedSeats
                .map(
                  eachSelectedSeat =>
                    eachSelectedSeat.row + eachSelectedSeat.column,
                )
                .join(', ')}
            </Text>
            <Text style={styles.priceHighlight}>
              {totalPriceSeats.toLocaleString('vi-VN') + 'đ'}
            </Text>
          </View>
        </View>

        {/* Combos Section */}
        {selectedCombos.length > 0 && (
            <View style={styles.section}>
            <Text style={styles.sectionTitle}>
                Selected Combos
            </Text>
            {selectedCombos.map(eachCombo => (
                <View
                key={eachCombo.combo.comboId}
                style={styles.comboItem}>
                <Image
                    source={{uri: getComboImgae(eachCombo.combo.imageURL)}}
                    style={styles.comboImage}
                />
                <View style={styles.comboInfo}>
                    <Text style={styles.comboName}>
                    {eachCombo.combo.name}
                    </Text>
                    <Text style={styles.comboQuantity}>
                    Quantity: {eachCombo.quantity}
                    </Text>
                </View>
                <Text style={styles.priceHighlight}>
                    {(eachCombo.quantity * eachCombo.combo.price).toLocaleString(
                    'vi-VN',
                    ) + 'đ'}
                </Text>
                </View>
            ))}
            </View>
        )}

        {/* Promotions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Promotions
          </Text>

          <TouchableOpacity
            style={styles.discountButton}
            onPress={() => showModal('coupon')}
            activeOpacity={0.7}>
            <Icon source="gift" size={24} color={THEME.primaryRed} />
            <Text style={styles.discountText}>
              {coupon ? `Code: ${coupon.code}` : 'Choose Your Coupon'}
            </Text>
            <View style={styles.discountRight}>
              {coupon && (
                <Text style={styles.discountValue}>
                  -{(coupon?.discountAmount.toLocaleString('vi-VN') || 0) + 'đ'}
                </Text>
              )}

              <Icon source="chevron-right" size={20} color={THEME.textGray} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.discountButton}
            onPress={() => showModal('points')}
            activeOpacity={0.7}>
            <Icon source="star" size={24} color={THEME.primaryRed} />
            <Text style={styles.discountText}>
              {usedPoints > 0
                ? `Used: ${usedPoints} points`
                : 'Use Loyalpoints'}
            </Text>
            <View style={styles.discountRight}>
              {usedPoints > 0 && (
                <Text style={styles.discountValue}>
                  -{usedPoints.toLocaleString('vi-VN') + 'đ'}
                </Text>
              )}
              <Icon source="chevron-right" size={20} color={THEME.textGray} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Summary Section */}
        <View
          style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              SubTotal:
            </Text>
            <Text style={styles.totalValue}>
              {subTotal.toLocaleString('vi-VN') + 'đ'}
            </Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              Discount:
            </Text>
            <Text style={styles.discountValueHighlight}>
              -{(coupon?.discountAmount.toLocaleString('vi-VN') || 0) + 'đ'}
            </Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              Points:
            </Text>
            <Text style={styles.discountValueHighlight}>
              -{usedPoints.toLocaleString('vi-VN') + 'đ'}
            </Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              Rank {rank?.discount}%:
            </Text>
            <Text style={styles.discountValueHighlight}>
              -{totalRankDiscount.toLocaleString('vi-VN') + 'đ'}
            </Text>
          </View>

          <View style={[styles.totalRow, styles.finalTotal]}>
            <Text style={styles.finalTotalLabel}>
              Total Price:
            </Text>
            <Text style={styles.finalTotalValue}>
              {totalPrice.toLocaleString('vi-VN') + 'đ'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.paymentButton}
          activeOpacity={0.8}
          onPress={() => handleBooking()}>
          <Text style={styles.paymentButtonText}>
            Confirm Booking
          </Text>
        </TouchableOpacity>
      </ScrollView>

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
    borderRadius: 8,
    backgroundColor: THEME.cardBg,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.textWhite,
  },
  movieHeader: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 20,
    marginBottom: 20,
    backgroundColor: THEME.cardBg,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  movieImage: {
    width: 90,
    height: 130,
    borderRadius: 12,
    marginRight: 15,
  },
  movieInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: THEME.textWhite,
    letterSpacing: 0.5,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    marginLeft: 8,
    color: THEME.textGray,
    fontWeight: '500',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: THEME.textWhite,
  },
  seatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: THEME.cardBg,
  },
  seatText: {
    fontSize: 15,
    flex: 1,
    marginLeft: 12,
    color: THEME.textWhite,
    fontWeight: '600',
  },
  priceHighlight: {
    fontSize: 16,
    fontWeight: 'bold',
    color: THEME.primaryRed,
  },
  comboItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: THEME.cardBg,
  },
  comboImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#000',
  },
  comboInfo: {
    flex: 1,
  },
  comboName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
    color: THEME.textWhite,
  },
  comboQuantity: {
    fontSize: 13,
    color: THEME.textGray,
  },
  discountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: THEME.cardBg,
  },
  discountText: {
    fontSize: 15,
    flex: 1,
    marginLeft: 12,
    color: THEME.textWhite,
  },
  discountRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountValue: {
    fontSize: 15,
    fontWeight: 'bold',
    marginRight: 8,
    color: THEME.primaryRed,
  },
  totalSection: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    backgroundColor: THEME.cardBg,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  finalTotal: {
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: THEME.divider,
  },
  totalLabel: {
    fontSize: 15,
    color: THEME.textGray,
  },
  totalValue: {
    fontSize: 15,
    fontWeight: '600',
    color: THEME.textWhite,
  },
  discountValueHighlight: {
      fontSize: 15,
      fontWeight: '600',
      color: THEME.primaryRed,
  },
  finalTotalLabel: {
      fontSize: 18,
      fontWeight: 'bold',
      color: THEME.textWhite,
  },
  finalTotalValue: {
      fontSize: 22,
      fontWeight: 'bold',
      color: THEME.primaryRed,
  },
  paymentButton: {
    padding: 18,
    borderRadius: 30, // Pill shape
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: THEME.primaryRed,
    shadowColor: THEME.primaryRed,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  paymentButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 0.5,
  },
});

export default MovieTicketScreen;