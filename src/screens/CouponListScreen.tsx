/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  SafeAreaView,
  Dimensions,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons'; // Changed to Ionicons
import {useFocusEffect} from '@react-navigation/native';
import { format } from 'date-fns'; // Use 'format' from date-fns
import { useSpinner } from '../context/SpinnerContext';
import { getCouponsByClient } from '../services/CouponService';
import { CouponProps } from '../types/coupon';
import { CouponListScreenProps } from '../types/screentypes';
import { showToast, checkErrorFetchingData } from '../utils/function';

// THEME COLORS CONSISTENT WITH OTHER SCREENS
const COLORS = {
  background: '#0B0F19', // Deep dark blue/black background
  card: '#1D212E', // Slightly lighter for buttons/cards
  primary: '#F54B46', // Coral red
  text: '#FFFFFF',
  textSecondary: '#7B8299', // Muted text color
  success: '#10B981', // Green for active status
};

const {width} = Dimensions.get('window');

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
          // Assuming the date property for expiry is a valid date string/number
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
    }, [clientEmail]),
  );

  const renderCouponItem = useCallback((coupon: CouponProps) => {
    // Determine if the coupon is expired
    const now = new Date();
    // Safely parse the expiry date string/number
    const expiryDate = new Date(coupon.expiryDate); 
    const isExpired = expiryDate < now;
    
    // Status text and color
    const statusText = isExpired ? 'Đã hết hạn' : 'Còn hiệu lực';
    const statusColor = isExpired ? COLORS.textSecondary : COLORS.success;
    const cardOpacity = isExpired ? 0.6 : 1;
    const expiryText = format(expiryDate, 'dd/MM/yyyy');

    return (
      <View
        key={coupon.couponId}
        style={[
          styles.couponCard,
          {backgroundColor: COLORS.card, opacity: cardOpacity},
        ]}>
        
        {/* Main Info Section */}
        <View style={styles.couponMainInfo}>
          
          {/* Discount Column */}
          <View style={styles.discountSection}>
            <Text style={[styles.discountAmount, {color: COLORS.primary}]}>
              {coupon.discountAmount.toLocaleString('vi-VN')}đ
            </Text>
            <Text style={[styles.discountLabel, {color: COLORS.textSecondary}]}>
              GIẢM GIÁ
            </Text>
          </View>

          {/* Vertical Separator */}
          <View style={styles.separator} />
          
          {/* Coupon Details */}
          <View style={styles.couponInfo}>
            <Text style={[styles.couponCode, {color: COLORS.text}]}>
              Mã: {coupon.code}
            </Text>
            <Text style={[styles.couponDescription, {color: COLORS.text}]}>
              {coupon.description || 'Áp dụng cho mọi vé xem phim.'}
            </Text>
            <Text style={[styles.expiryDate, {color: COLORS.textSecondary}]}>
              Hạn dùng: {expiryText}
            </Text>
          </View>
        </View>

        {/* Footer/Action Section */}
        <View style={styles.couponFooter}>
            {/* Status Badge */}
            <View style={[styles.statusBadge, {backgroundColor: isExpired ? COLORS.card : statusColor}]}>
                <Text style={styles.statusText}>{statusText}</Text>
            </View>

            {/* Apply Button (Only visible if not expired) */}
            {!isExpired && (
                <TouchableOpacity style={styles.applyButton}>
                    <Text style={styles.applyButtonText}>Áp dụng</Text>
                </TouchableOpacity>
            )}
        </View>
      </View>
    );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      {/* Consistent Header Style */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>
          My Coupons ({coupons.length})
        </Text>
        
        <View style={styles.placeholder} />
      </View>


      <FlatList
        data={coupons}
        renderItem={({item}) => renderCouponItem(item)}
        keyExtractor={item => item.couponId.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <Icon name="ticket-outline" size={60} color={COLORS.textSecondary} />
                <Text style={styles.emptyText}>You don't have any coupons yet.</Text>
            </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // --- Header Styles ---
  header: {
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
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },
  placeholder: {
    width: 40,
  },
  // --- List & Item Styles ---
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  emptyContainer: {
    marginTop: 50,
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginTop: 10,
  },
  couponCard: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  couponMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 15,
  },
  discountSection: {
    alignItems: 'center',
    paddingRight: 15,
  },
  discountAmount: {
    fontSize: 22,
    fontWeight: '900',
    marginBottom: 4,
  },
  discountLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  separator: {
    width: 2,
    height: '100%',
    backgroundColor: COLORS.card, // Separator color, slightly darker than card
    marginRight: 15,
    // Add a subtle dashed effect if desired, but for RN simplicity, a solid line is often better
    borderLeftWidth: 1,
    borderLeftColor: COLORS.textSecondary + '50', // Lighter dashed line effect
  },
  couponInfo: {
    flex: 1,
  },
  couponCode: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  couponDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  expiryDate: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 5,
  },
  couponFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: COLORS.textSecondary + '30', // Light separator
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  applyButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },
});

export default CouponListScreen;