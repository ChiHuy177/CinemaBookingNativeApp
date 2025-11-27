/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { InfoTicketRow } from '../components/InfoTicketRow';
import dayjs from 'dayjs';
import { navigate } from '../utils/navigation';
import { useFocusEffect } from '@react-navigation/native';
import { Icon } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';
import { colors } from '../constant/color';
import { useSpinner } from '../context/SpinnerContext';
import { getTicket } from '../services/TicketService';
import { TicketDetailScreenProps } from '../types/screentypes';
import { TicketProps } from '../types/ticket';
import { showToast, checkErrorFetchingData } from '../utils/function';

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
          <Icon source="chevron-left" size={30} color="white" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.white }]}>
          Ticket Detail
        </Text>
        <View style={styles.placeholder} />
      </View>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.qrSection}>
          <Text style={styles.qrTitle}>QR Code</Text>
          <View style={styles.qrContainer}>
            {ticket && (
              <QRCode
                value={verificationUrl}
                size={200}
                backgroundColor={colors.white}
                color={colors.dark}
              />
            )}
          </View>
          <Text style={styles.ticketCode}>Code: {ticket?.ticketCode}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionHeader}>Movie Information</Text>
          <InfoTicketRow label="Cinema" value={ticket?.cinemaName || ''} />
          <InfoTicketRow
            label="Date and time"
            value={dayjs(ticket?.showingTime.startTime).format(
              'YYYY/MM/DD - HH:mm:ss',
            )}
          />
          <InfoTicketRow
            label="Seats"
            value={
              ticket?.seats
                .map(eachSeat => eachSeat.row + eachSeat.column)
                .join(', ') || ''
            }
          />
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionHeader}>Price Information</Text>
          <InfoTicketRow
            label="Seat Price"
            value={ticket?.totalPriceSeats || 0}
            isPrice
          />
          <InfoTicketRow
            label="Combo Price"
            value={ticket?.totalPriceCombos || 0}
            isPrice
          />
          {ticket?.coupon && (
            <InfoTicketRow
              label="Coupon Discount"
              value={-ticket.coupon.discountAmount}
              isPrice
            />
          )}
          <InfoTicketRow
            label="Rank Discount"
            value={ticket?.totalRankDiscount ? -ticket.totalRankDiscount : -0}
            isPrice
          />
          <InfoTicketRow
            label="Loyal Points Used"
            value={-`${ticket?.loyalPointsUsed}`}
            isPrice
          />
          {ticket?.coupon && (
            <InfoTicketRow label="Coupon Name" value={ticket.coupon.code} />
          )}
          <View style={styles.divider} />
          <InfoTicketRow
            label="Total Price"
            value={ticket?.totalPrice || 0}
            isPrice
          />
        </View>

        {ticket?.combos && ticket?.combos.length > 0 && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionHeader}>Combos</Text>
            {ticket.combos.map(combo => (
              <View key={combo.comboId} style={styles.comboItemContainer}>
                <Text style={styles.comboItem}>{combo.name}</Text>
                <Text style={styles.comboItem}>x{combo.quantity}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.infoSection}>
          <Text style={styles.sectionHeader}>Ticket Status </Text>
          <InfoTicketRow
            label="Booking Time"
            value={dayjs(ticket?.createdAt).format('YYYY/MM/DD - HH:mm:ss')}
          />
          {ticket?.usedAt ? (
            <InfoTicketRow
              label="Used At"
              value={dayjs(ticket?.usedAt).format('YYYY/MM/DD - HH:mm:ss')}
            />
          ) : (
            <Text style={styles.unusedText}>ACTIVE</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  scrollView: {
    flex: 1,
  },
  qrSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: colors.mediumGray,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
  },
  qrTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  qrContainer: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketCode: {
    color: colors.lightGray,
    fontSize: 14,
    marginBottom: 20,
  },
  verifyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  verifyButtonDisabled: {
    backgroundColor: colors.lightGray,
  },
  verifyButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    backgroundColor: colors.mediumGray,
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionHeader: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  divider: {
    height: 1,
    backgroundColor: colors.lightGray,
    marginVertical: 10,
  },
  comboItem: {
    color: colors.white,
    fontSize: 14,
  },
  comboItemContainer: {
    paddingVertical: 4,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unusedText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  statusSection: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  statusBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  validBadge: {
    backgroundColor: colors.primary,
  },
  usedBadge: {
    backgroundColor: colors.lightGray,
  },
  statusText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default TicketDetailScreen;
