/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';

import {Icon} from 'react-native-paper';
import {useFocusEffect} from '@react-navigation/native';
import { formatDate } from 'date-fns';
import { colors } from '../constant/color';
import { useSpinner } from '../context/SpinnerContext';
import { getCouponsByClient } from '../services/CouponService';
import { CouponProps } from '../types/coupon';
import { CouponListScreenProps } from '../types/screentypes';
import { showToast, checkErrorFetchingData } from '../utils/function';

const CouponListScreen: React.FC<CouponListScreenProps> = ({
  route,
  navigation,
}) => {
  const {clientEmail} = route.params;
  const [coupons, setCoupons] = useState<CouponProps[]>([]);
  const {showSpinner, hideSpinner} = useSpinner();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      async function fetchingCoupons() {
        try {
          showSpinner();
          const responseDate = await getCouponsByClient(clientEmail);
          if (responseDate.code === 1000 && isActive) {
            setCoupons(responseDate.result);
          } else {
            showToast({
              type: 'error',
              text1: responseDate.message || 'Failed to fetch coupons',
            });
          }
        } catch (error) {
          checkErrorFetchingData({
            error: error,
            title: 'Error getting coupons',
          });
        } finally {
          hideSpinner();
        }
      }

      fetchingCoupons();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const renderCouponItem = useCallback((coupon: CouponProps) => {
    return (
      <View
        key={coupon.couponId}
        style={[styles.couponCard, {backgroundColor: colors.mediumGray}]}>
        <View style={styles.couponHeader}>
          <View style={styles.discountSection}>
            <Text style={[styles.discountAmount, {color: colors.primary}]}>
              {coupon.discountAmount.toLocaleString('vi-VN')}đ
            </Text>
            <Text style={[styles.discountLabel, {color: colors.lightGray}]}>
              Discount
            </Text>
          </View>

          <View style={styles.couponInfo}>
            <Text style={[styles.couponCode, {color: colors.white}]}>
              {coupon.code}
            </Text>
            <Text style={[styles.expiryDate, {color: colors.lightGray}]}>
              Expiry: {formatDate(coupon.expiryDate)}
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: colors.green,
              },
            ]}>
            <Text style={styles.statusText}>Còn hiệu lực</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.decorativeBorder}>
          <View
            style={[
              styles.circle,
              styles.leftCircle,
              {backgroundColor: colors.dark},
            ]}
          />
          <View style={styles.dashedLine} />
          <View
            style={[
              styles.circle,
              styles.rightCircle,
              {backgroundColor: colors.dark},
            ]}
          />
        </View>
      </View>
    );
  }, []);

  return (
    <View style={[styles.container, {backgroundColor: colors.dark}]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.dark} />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon source="chevron-left" size={30} color="white" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: colors.white}]}>
          My Coupons
        </Text>
        <View style={styles.placeholder} />
      </View>

      <FlatList
        data={coupons}
        renderItem={item => renderCouponItem(item.item)}
        keyExtractor={item => item.couponId.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 50,
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

  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  couponCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  expiredCard: {
    opacity: 0.6,
  },
  couponHeader: {
    flexDirection: 'row',
    padding: 16,
  },
  discountSection: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 100,
  },
  discountAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  discountLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  couponInfo: {
    flex: 1,
  },
  couponCode: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  expiryDate: {
    fontSize: 14,
    marginBottom: 8,
  },
  statusContainer: {
    alignItems: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  decorativeBorder: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    height: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  leftCircle: {
    marginLeft: -10,
  },
  rightCircle: {
    marginRight: -10,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderTopWidth: 1,
    borderTopColor: '#555',
    borderStyle: 'dashed',
  },
});

export default CouponListScreen;
