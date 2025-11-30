/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useMemo, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
 // Dimensions,
} from 'react-native';
import dayjs from 'dayjs';
import Icon from 'react-native-vector-icons/Ionicons'; // Switched to Ionicons
import QRCode from 'react-native-qrcode-svg'; // Uncommented for functionality

import {navigate} from '../utils/navigation';
import {useFocusEffect} from '@react-navigation/native';
import {useSpinner} from '../context/SpinnerContext';
import {getTicket} from '../services/TicketService';
import {TicketDetailScreenProps} from '../types/screentypes';
import {TicketProps} from '../types/ticket';
import {showToast, checkErrorFetchingData} from '../utils/function';

// const {width} = Dimensions.get('window');

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
  shadowColor: '#FF3B30',
};

const TicketDetailScreen: React.FC<TicketDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const {ticketId, isFromBooking} = route.params;

  const [ticket, setTicket] = useState<TicketProps | null>(null);

  const {showSpinner, hideSpinner} = useSpinner();

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
              text1: 'Error',
              text2: responseData.message,
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
      
      return () => {
          isActive = false;
      }
    }, []),
  );

  const verificationUrl = useMemo(() => {
    return `https://localhost:7092/api/ticket/verify/${ticket?.ticketCode}`;
  }, [ticket]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.glassButton}
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
          }}>
          <Icon name="chevron-back" size={24} color={THEME.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ticket Details</Text>
        <View style={{width: 40}} /> 
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 40}}>
        
        {/* QR CODE SECTION */}
        <View style={styles.qrSection}>
          <Text style={styles.qrLabel}>SCAN FOR ENTRY</Text>
          <View style={styles.qrContainer}>
            {ticket && (
              <QRCode
                value={verificationUrl}
                size={180}
                backgroundColor="transparent"
                color="black"
              />
            )}
            {/* Corner Markers for "Scanner" Look */}
            <View style={[styles.cornerMarker, styles.topLeft]} />
            <View style={[styles.cornerMarker, styles.topRight]} />
            <View style={[styles.cornerMarker, styles.bottomLeft]} />
            <View style={[styles.cornerMarker, styles.bottomRight]} />
          </View>
          
          <View style={styles.codeContainer}>
             <Text style={styles.codeLabel}>TICKET ID</Text>
             <Text style={styles.ticketCode}>{ticket?.ticketCode}</Text>
          </View>
          
          {/* Decorative Glow */}
          <View style={styles.qrGlow} />
        </View>

        {/* MOVIE INFO SECTION */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
             <Text style={styles.sectionTitle}>Movie Details</Text>
             <Icon name="film-outline" size={18} color={THEME.textGray} />
          </View>
          
          <View style={styles.infoRow}>
            <View style={styles.labelGroup}>
                <Icon name="location-outline" size={16} color={THEME.textDarkGray} />
                <Text style={styles.label}>Cinema</Text>
            </View>
            <Text style={styles.value}>{ticket?.cinemaName || ''}</Text>
          </View>
          
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.labelGroup}>
                <Icon name="calendar-outline" size={16} color={THEME.textDarkGray} />
                <Text style={styles.label}>Date & Time</Text>
            </View>
            <Text style={styles.value}>
              {dayjs(ticket?.showingTime.startTime).format('MMM DD, YYYY • HH:mm')}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.labelGroup}>
                <Icon name="grid-outline" size={16} color={THEME.textDarkGray} />
                <Text style={styles.label}>Seats</Text>
            </View>
            <Text style={[styles.value, styles.highlightValue]}>
              {ticket?.seats.map(eachSeat => eachSeat.row + eachSeat.column).join(', ') || ''}
            </Text>
          </View>
        </View>

        {/* COMBOS SECTION */}
        {ticket?.combos && ticket?.combos.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Snacks & Drinks</Text>
                <Icon name="fast-food-outline" size={18} color={THEME.textGray} />
            </View>
            {ticket.combos.map((combo, index) => (
              <View
                key={combo.comboId}
                style={[
                  styles.comboRow,
                  index !== ticket.combos.length - 1 && styles.borderBottom,
                ]}>
                <Text style={styles.comboName}>{combo.name}</Text>
                <Text style={styles.comboQty}>x{combo.quantity}</Text>
              </View>
            ))}
          </View>
        )}

        {/* PAYMENT DETAILS */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Seats Total</Text>
            <Text style={styles.paymentValue}>
              {ticket?.totalPriceSeats.toLocaleString()} đ
            </Text>
          </View>

          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Combos Total</Text>
            <Text style={styles.paymentValue}>
              {ticket?.totalPriceCombos.toLocaleString()} đ
            </Text>
          </View>

          {ticket?.coupon && (
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Coupon ({ticket.coupon.code})</Text>
              <Text style={styles.discountValue}>
                -{ticket.coupon.discountAmount.toLocaleString()} đ
              </Text>
            </View>
          )}

          {ticket?.totalRankDiscount ? (
             <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Rank Discount</Text>
                <Text style={styles.discountValue}>
                    -{ticket.totalRankDiscount.toLocaleString()} đ
                </Text>
            </View>
          ) : null}

          {ticket?.loyalPointsUsed ? (
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Points Used</Text>
                <Text style={styles.discountValue}>
                    -{ticket.loyalPointsUsed.toLocaleString()} đ
                </Text>
            </View>
          ) : null}

          <View style={styles.dashedDivider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Paid</Text>
            <Text style={styles.totalValue}>
              {ticket?.totalPrice.toLocaleString()} đ
            </Text>
          </View>
        </View>

        {/* TICKET STATUS */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Status</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.label}>Booked On</Text>
            <Text style={styles.value}>
               {dayjs(ticket?.createdAt).format('MMM DD, HH:mm')}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.label}>Current Status</Text>
            {ticket?.usedAt ? (
              <View style={styles.statusBadgeUsed}>
                <Icon name="checkmark-circle" size={14} color={THEME.textGray} />
                <Text style={styles.statusTextUsed}>
                  Used: {dayjs(ticket?.usedAt).format('MM/DD HH:mm')}
                </Text>
              </View>
            ) : (
              <View style={styles.statusBadgeActive}>
                <Icon name="ticket" size={14} color={THEME.successGreen} />
                <Text style={styles.statusTextActive}>VALID</Text>
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
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: THEME.background,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
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
  
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // QR Section
  qrSection: {
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 25,
    position: 'relative',
  },
  qrLabel: {
    color: THEME.textGray,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 15,
  },
  qrContainer: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  // Markers
  cornerMarker: {
      position: 'absolute',
      width: 20,
      height: 20,
      borderColor: THEME.primaryRed,
      borderWidth: 3,
  },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: 10 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: 10 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: 10 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: 10 },

  qrGlow: {
      position: 'absolute',
      top: '20%',
      left: '10%',
      width: '80%',
      height: 200,
      backgroundColor: THEME.primaryRed,
      opacity: 0.15,
      borderRadius: 100,
      zIndex: -1,
      transform: [{scale: 1.2}],
  },
  codeContainer: {
      marginTop: 15,
      alignItems: 'center',
  },
  codeLabel: {
      fontSize: 10,
      color: THEME.textDarkGray,
      letterSpacing: 1,
  },
  ticketCode: {
      fontSize: 20,
      fontWeight: 'bold',
      color: THEME.textWhite,
      letterSpacing: 1,
      textShadowColor: THEME.primaryRed,
      textShadowOffset: {width: 0, height: 0},
      textShadowRadius: 10,
  },

  // Sections
  sectionContainer: {
    backgroundColor: THEME.cardBg,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  sectionHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
  },
  sectionTitle: {
    color: THEME.textWhite,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 15, // Default if no icon row
  },
  
  // Info Rows
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  labelGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
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
    flex: 1,
    marginLeft: 15,
  },
  highlightValue: {
      color: THEME.primaryRed,
      fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: THEME.border,
    marginVertical: 10,
  },
  dashedDivider: {
    height: 1,
    backgroundColor: THEME.border,
    marginVertical: 12,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: THEME.border,
  },

  // Combos
  comboRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  comboName: {
    color: THEME.textWhite,
    fontSize: 14,
  },
  comboQty: {
    color: THEME.textGray,
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Payment
  paymentRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
  },
  paymentLabel: {
      color: THEME.textGray,
      fontSize: 14,
  },
  paymentValue: {
      color: THEME.textWhite,
      fontSize: 14,
      fontWeight: '500',
  },
  discountValue: {
      color: THEME.successGreen,
      fontSize: 14,
      fontWeight: '500',
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
      fontSize: 20,
      fontWeight: 'bold',
  },

  // Status
  statusBadgeActive: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(52, 199, 89, 0.15)',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      gap: 5,
  },
  statusTextActive: {
      color: THEME.successGreen,
      fontWeight: 'bold',
      fontSize: 12,
  },
  statusBadgeUsed: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.05)',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      gap: 5,
  },
  statusTextUsed: {
      color: THEME.textGray,
      fontSize: 12,
  }
});

export default TicketDetailScreen;