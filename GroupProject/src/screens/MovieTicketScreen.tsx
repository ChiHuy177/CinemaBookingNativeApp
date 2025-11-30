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
import { colors } from '../constant/color';
import { useSpinner } from '../context/SpinnerContext';
import { getClientRank } from '../services/RankService';
import { addTicket } from '../services/TicketService';
import { CouponProps } from '../types/coupon';
import { ClientRankProps } from '../types/rank';
import { CreateTicketProps } from '../types/ticket';
import { showToast, checkErrorFetchingData, getPosterImage, getComboImgae } from '../utils/function';
import { getEmailAndToken } from '../utils/storage';



const {width} = Dimensions.get('window');

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
    <SafeAreaView style={[styles.container, {backgroundColor: colors.dark}]}>
      <StatusBar backgroundColor={colors.dark} barStyle="light-content" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon source="chevron-left" size={35} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, {color: colors.white}]}>
            Ticket Information
          </Text>
        </View>

        <View
          style={[styles.movieHeader, {backgroundColor: colors.mediumGray}]}>
          <Image
            source={{uri: getPosterImage(poster)}}
            style={styles.movieImage}
          />
          <View style={styles.movieInfo}>
            <Text
              style={[styles.movieTitle, {color: colors.white}]}
              ellipsizeMode="tail"
              numberOfLines={3}>
              {movieTitle}
            </Text>
            <View style={styles.infoRow}>
              <Icon source="map-marker" size={16} color={colors.lightGray} />
              <Text style={[styles.infoText, {color: colors.lightGray}]}>
                {cinemaName}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Icon source="calendar" size={16} color={colors.lightGray} />
              <Text style={[styles.infoText, {color: colors.lightGray}]}>
                {date}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Icon source="clock" size={16} color={colors.lightGray} />
              <Text style={[styles.infoText, {color: colors.lightGray}]}>
                {time}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: colors.white}]}>
            Selected Seats
          </Text>
          <View
            style={[
              styles.seatContainer,
              {backgroundColor: colors.mediumGray},
            ]}>
            <Icon source="seat" size={20} color={colors.primary} />
            <Text style={[styles.seatText, {color: colors.white}]}>
              {selectedSeats
                .map(
                  eachSelectedSeat =>
                    eachSelectedSeat.row + eachSelectedSeat.column,
                )
                .join(', ')}
            </Text>
            <Text style={[styles.seatPrice, {color: colors.primary}]}>
              {totalPriceSeats.toLocaleString('vi-VN') + 'đ'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: colors.white}]}>
            Selected Combos
          </Text>
          {selectedCombos.map(eachCombo => (
            <View
              key={eachCombo.combo.comboId}
              style={[styles.comboItem, {backgroundColor: colors.mediumGray}]}>
              <Image
                source={{uri: getComboImgae(eachCombo.combo.imageURL)}}
                style={styles.comboImage}
              />
              <View style={styles.comboInfo}>
                <Text style={[styles.comboName, {color: colors.white}]}>
                  {eachCombo.combo.name}
                </Text>
                <Text style={[styles.comboQuantity, {color: colors.lightGray}]}>
                  Quantity: {eachCombo.quantity}
                </Text>
              </View>
              <Text style={[styles.comboPrice, {color: colors.primary}]}>
                {(eachCombo.quantity * eachCombo.combo.price).toLocaleString(
                  'vi-VN',
                ) + 'đ'}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: colors.white}]}>
            Promotions
          </Text>

          <TouchableOpacity
            style={[
              styles.discountButton,
              {backgroundColor: colors.mediumGray},
            ]}
            onPress={() => showModal('coupon')}
            activeOpacity={0.7}>
            <Icon source="gift" size={24} color={colors.primary} />
            <Text style={[styles.discountText, {color: colors.white}]}>
              {coupon ? `Code: ${coupon.code}` : 'Choose Your Coupon'}
            </Text>
            <View style={styles.discountRight}>
              {coupon && (
                <Text style={[styles.discountValue, {color: colors.primary}]}>
                  -{(coupon?.discountAmount.toLocaleString('vi-VN') || 0) + 'đ'}
                </Text>
              )}

              <Icon source="chevron-right" size={20} color={colors.lightGray} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.discountButton,
              {backgroundColor: colors.mediumGray},
            ]}
            onPress={() => showModal('points')}
            activeOpacity={0.7}>
            <Icon source="star" size={24} color={colors.primary} />
            <Text style={[styles.discountText, {color: colors.white}]}>
              {usedPoints > 0
                ? `Used: ${usedPoints} points`
                : 'Use Loyalpoints'}
            </Text>
            <View style={styles.discountRight}>
              {usedPoints > 0 && (
                <Text style={[styles.discountValue, {color: colors.primary}]}>
                  -{usedPoints.toLocaleString('vi-VN') + 'đ'}
                </Text>
              )}
              <Icon source="chevron-right" size={20} color={colors.lightGray} />
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={[styles.totalSection, {backgroundColor: colors.mediumGray}]}>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, {color: colors.lightGray}]}>
              SubTotal:
            </Text>
            <Text style={[styles.totalValue, {color: colors.white}]}>
              {subTotal.toLocaleString('vi-VN') + 'đ'}
            </Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, {color: colors.lightGray}]}>
              Discount:
            </Text>
            <Text style={[styles.totalValue, {color: colors.primary}]}>
              -{(coupon?.discountAmount.toLocaleString('vi-VN') || 0) + 'đ'}
            </Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, {color: colors.lightGray}]}>
              Points:
            </Text>
            <Text style={[styles.totalValue, {color: colors.primary}]}>
              -{usedPoints.toLocaleString('vi-VN') + 'đ'}
            </Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, {color: colors.lightGray}]}>
              Rank {rank?.discount}%:
            </Text>
            <Text style={[styles.totalValue, {color: colors.primary}]}>
              -{totalRankDiscount.toLocaleString('vi-VN') + 'đ'}
            </Text>
          </View>

          <View style={[styles.totalRow, styles.finalTotal]}>
            <Text
              style={[
                styles.totalLabel,
                {color: colors.white, fontSize: 18, fontWeight: 'bold'},
              ]}>
              Total Price:
            </Text>
            <Text
              style={[
                styles.totalValue,
                {color: colors.primary, fontSize: 20, fontWeight: 'bold'},
              ]}>
              {totalPrice.toLocaleString('vi-VN') + 'đ'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.paymentButton, {backgroundColor: colors.primary}]}
          activeOpacity={0.8}
          onPress={() => handleBooking()}>
          <Text style={[styles.paymentButtonText, {color: colors.white}]}>
            Booking
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
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 15,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  movieHeader: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  movieImage: {
    width: 100,
    height: 140,
    borderRadius: 10,
    marginRight: 15,
  },
  movieInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  seatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  seatText: {
    fontSize: 16,
    flex: 1,
    marginLeft: 12,
  },
  seatPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  comboItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  comboImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  comboInfo: {
    flex: 1,
  },
  comboName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  comboQuantity: {
    fontSize: 14,
  },
  comboPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  discountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  discountText: {
    fontSize: 16,
    flex: 1,
    marginLeft: 12,
  },
  discountRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  totalSection: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  finalTotal: {
    marginTop: 10,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#555',
  },
  totalLabel: {
    fontSize: 16,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  paymentButton: {
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  paymentButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MovieTicketScreen;
