/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { InfoTicketRow } from '../components/InfoTicketRow'; // Assuming this component handles its own text color or accepts props. If it relies on global colors, it might look slightly different, but the container will be themed.
import dayjs from 'dayjs';
import { navigate } from '../utils/navigation';
import { useFocusEffect } from '@react-navigation/native';
import { Icon } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
// import { colors } from '../constant/color'; // Replaced with local THEME
import { useSpinner } from '../context/SpinnerContext';
import { getTicket } from '../services/TicketService';
import { TicketDetailScreenProps } from '../types/screentypes';
import { TicketProps } from '../types/ticket';
import { showToast, checkErrorFetchingData } from '../utils/function';

// THEME CONSTANTS EXTRACTED FROM IMAGE
const THEME = {
  background: '#13141F', // Dark blue-black background
  primaryRed: '#F54B64', // Coral red
  cardBg: '#20212D',     // Slightly lighter for cards
  textWhite: '#FFFFFF',
  textGray: '#8F9BB3',   // Muted blue-gray text
  divider: 'rgba(255,255,255,0.08)',
};

const TicketDetailScreen: React.FC<TicketDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { ticketId, isFromBooking } = route.params;

  const [ticket, setTicket] = useState<TicketProps | null>(null);

  const { showSpinner, hideSpinner } = useSpinner();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function fetchingTicket() {
        try {
          showSpinner();
          const responseData = await getTicket(ticketId);
          if (responseData.code === 1000 && isActive) {
            setTicket(responseData.result);
          } else {
            showToast({
              type: 'error',
              text1: responseData.message,
            });
          }
        } catch (error) {
          checkErrorFetchingData({
            error: error,
            title: 'Error fetching ticket',
          });
        } finally {
          hideSpinner();
        }
      }
      fetchingTicket();
    }, []),
  );

  const verificationUrl = useMemo(() => {
    return `https://localhost:7092/api/ticket/verify/${ticket?.ticketCode}`;
  }, [ticket]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.background} />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (isFromBooking) {
              navigate('MainTabs', {
                screen: 'HomeStack',
                params: {
                  screen: 'HomeScreen',
                },
              });
            } else {
              navigation.goBack();
            }
          }}
        >
          <Icon source="chevron-left" size={28} color={THEME.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Ticket Detail
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* QR CODE SECTION */}
        <View style={styles.qrSection}>
          <Text style={styles.qrTitle}>Scan QR Code</Text>
          <View style={styles.qrContainer}>
            {ticket && (
              <QRCode
                value={verificationUrl}
                size={180}
                backgroundColor="white"
                color="black"
              />
            )}
          </View>
          <Text style={styles.ticketCode}>Code: <Text style={{fontWeight: 'bold', color: THEME.textWhite}}>{ticket?.ticketCode}</Text></Text>
        </View>

        {/* MOVIE INFO SECTION */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionHeader}>Movie Information</Text>
          <View style={styles.row}>
             <Text style={styles.label}>Cinema</Text>
             <Text style={styles.value}>{ticket?.cinemaName || ''}</Text>
          </View>
          <View style={styles.divider} />
          
          <View style={styles.row}>
             <Text style={styles.label}>Date & Time</Text>
             <Text style={styles.value}>{dayjs(ticket?.showingTime.startTime).format('YYYY/MM/DD - HH:mm')}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.row}>
             <Text style={styles.label}>Seats</Text>
             <Text style={[styles.value, {color: THEME.primaryRed, fontWeight: 'bold'}]}>
                {ticket?.seats.map(eachSeat => eachSeat.row + eachSeat.column).join(', ') || ''}
             </Text>
          </View>
        </View>

        {/* COMBOS SECTION */}
        {ticket?.combos && ticket?.combos.length > 0 && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionHeader}>Combos</Text>
            {ticket.combos.map((combo, index) => (
              <View key={combo.comboId} style={[
                  styles.comboItemContainer, 
                  index !== ticket.combos.length - 1 && styles.borderBottom
              ]}>
                <Text style={styles.comboItem}>{combo.name}</Text>
                <Text style={[styles.comboItem, {fontWeight: 'bold'}]}>x{combo.quantity}</Text>
              </View>
            ))}
          </View>
        )}

        {/* PRICE INFO SECTION */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionHeader}>Payment Detail</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Seat Price</Text>
            <Text style={styles.value}>{ticket?.totalPriceSeats.toLocaleString()}đ</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Combo Price</Text>
            <Text style={styles.value}>{ticket?.totalPriceCombos.toLocaleString()}đ</Text>
          </View>

          {ticket?.coupon && (
             <View style={styles.row}>
                <Text style={styles.label}>Coupon ({ticket.coupon.code})</Text>
                <Text style={[styles.value, {color: THEME.primaryRed}]}>-{ticket.coupon.discountAmount.toLocaleString()}đ</Text>
             </View>
          )}

          <View style={styles.row}>
            <Text style={styles.label}>Rank Discount</Text>
            <Text style={[styles.value, {color: THEME.primaryRed}]}>
                {ticket?.totalRankDiscount ? `-${ticket.totalRankDiscount.toLocaleString()}đ` : '0đ'}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Loyal Points Used</Text>
            <Text style={[styles.value, {color: THEME.primaryRed}]}>
                {ticket?.loyalPointsUsed ? `-${ticket.loyalPointsUsed.toLocaleString()}đ` : '0đ'}
            </Text>
          </View>

          <View style={[styles.divider, {backgroundColor: THEME.textGray}]} />
          
          <View style={styles.row}>
            <Text style={[styles.label, {fontSize: 16, fontWeight: 'bold', color: THEME.textWhite}]}>Total</Text>
            <Text style={[styles.value, {fontSize: 20, fontWeight: 'bold', color: THEME.primaryRed}]}>
                {ticket?.totalPrice.toLocaleString()}đ
            </Text>
          </View>
        </View>

        {/* STATUS SECTION */}
        <View style={[styles.infoSection, {marginBottom: 30}]}>
          <Text style={styles.sectionHeader}>Ticket Status</Text>
          <View style={styles.row}>
             <Text style={styles.label}>Booked At</Text>
             <Text style={styles.value}>{dayjs(ticket?.createdAt).format('YYYY/MM/DD - HH:mm')}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
             <Text style={styles.label}>Status</Text>
             {ticket?.usedAt ? (
                <View style={styles.statusContainer}>
                    <Icon source="check-circle" size={16} color={THEME.textGray}/>
                    <Text style={styles.usedText}>Used: {dayjs(ticket?.usedAt).format('MM/DD HH:mm')}</Text>
                </View>
              ) : (
                <View style={styles.statusContainer}>
                    <Icon source="ticket-confirmation" size={18} color={THEME.primaryRed}/>
                    <Text style={styles.activeText}>ACTIVE</Text>
                </View>
              )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: THEME.background,
  },
  backButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: THEME.cardBg,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.textWhite,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  qrSection: {
    alignItems: 'center',
    paddingVertical: 25,
    backgroundColor: THEME.cardBg,
    marginTop: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  qrTitle: {
    color: THEME.textWhite,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  qrContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 16,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketCode: {
    color: THEME.textGray,
    fontSize: 14,
    marginTop: 5,
  },
  infoSection: {
    backgroundColor: THEME.cardBg,
    marginTop: 20,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionHeader: {
    color: THEME.textWhite,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
  },
  label: {
      color: THEME.textGray,
      fontSize: 14,
  },
  value: {
      color: THEME.textWhite,
      fontSize: 14,
      fontWeight: '500',
      textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: THEME.divider,
    marginVertical: 5,
  },
  comboItemContainer: {
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  borderBottom: {
      borderBottomWidth: 1,
      borderBottomColor: THEME.divider,
  },
  comboItem: {
    color: THEME.textWhite,
    fontSize: 14,
  },
  statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
  },
  activeText: {
    color: THEME.primaryRed,
    fontSize: 14,
    fontWeight: 'bold',
  },
  usedText: {
    color: THEME.textGray,
    fontSize: 14,
  }
});

export default TicketDetailScreen;