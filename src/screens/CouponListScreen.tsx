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

import Icon from 'react-native-vector-icons/Ionicons';
import {useFocusEffect} from '@react-navigation/native';
import { format } from 'date-fns';
import { useSpinner } from '../context/SpinnerContext';
import { getCouponsByClient } from '../services/CouponService';
import { CouponProps } from '../types/coupon';
import { CouponListScreenProps } from '../types/screentypes';
import { showToast, checkErrorFetchingData } from '../utils/function';

const {width} = Dimensions.get('window');

// THEME CONSTANTS MATCHING PREVIOUS SCREENS
const THEME = {
  background: '#10111D', // Dark cinematic background
  cardBg: '#1F2130',     // Input/Card background
  accent: '#FF3B30',     // Bright Red/Coral accent
  textWhite: '#FFFFFF',
  textGray: '#8F90A6',   // Muted gray
  textPlaceholder: '#5C5E6F',
  error: '#FF3B30',
  success: '#10B981',    // Green for active status
};

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
    }, [clientEmail]),
  );

  const renderCouponItem = useCallback((coupon: CouponProps) => {
    // Determine if the coupon is expired
    const now = new Date();
    // Safely parse the expiry date string/number
    const expiryDate = new Date(coupon.expiryDate); 
    const isExpired = expiryDate < now;
    
    // Status text and color
    const statusText = isExpired ? 'Expired' : 'Active';
    const statusColor = isExpired ? THEME.textPlaceholder : THEME.success;
    const cardOpacity = isExpired ? 0.6 : 1;
    const expiryText = format(expiryDate, 'dd/MM/yyyy');

    return (
      <View
        key={coupon.couponId}
        style={[
          styles.couponCard,
          {backgroundColor: THEME.cardBg, opacity: cardOpacity},
        ]}>
        
        {/* Main Info Section */}
        <View style={styles.couponMainInfo}>
          
          {/* Discount Column */}
          <View style={styles.discountSection}>
            <Text style={[styles.discountAmount, {color: THEME.accent}]}>
              {coupon.discountAmount.toLocaleString('vi-VN')}đ
            </Text>
            <Text style={[styles.discountLabel, {color: THEME.textGray}]}>
              DISCOUNT
            </Text>
          </View>

          {/* Vertical Separator */}
          <View style={styles.separator} />
          
          {/* Coupon Details */}
          <View style={styles.couponInfo}>
            <Text style={[styles.couponCode, {color: THEME.textWhite}]}>
              Code: <Text style={{fontWeight: '800', color: THEME.accent}}>{coupon.code}</Text>
            </Text>
            <Text style={[styles.couponDescription, {color: THEME.textGray}]} numberOfLines={2}>
              {coupon.discountAmount || 'Applicable for all movie tickets.'}
            </Text>
            <View style={styles.expiryContainer}>
                 <Icon name="time-outline" size={12} color={THEME.textGray} style={{marginRight: 4}} />
                 <Text style={[styles.expiryDate, {color: THEME.textGray}]}>
                  Exp: {expiryText}
                </Text>
            </View>
          </View>
        </View>

        {/* Footer/Action Section */}
        <View style={styles.couponFooter}>
            {/* Status Badge */}
            <View style={[styles.statusBadge, {backgroundColor: isExpired ? '#2C2E3E' : 'rgba(16, 185, 129, 0.15)'}]}>
                <Text style={[styles.statusText, {color: statusColor}]}>{statusText}</Text>
            </View>

            {/* Apply Button (Only visible if not expired) */}
            {!isExpired && (
                <TouchableOpacity style={styles.applyButton}>
                    <Text style={styles.applyButtonText}>Apply</Text>
                    <Icon name="chevron-forward" size={14} color="#FFF" />
                </TouchableOpacity>
            )}
        </View>
      </View>
    );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.background} />
      
      {/* Decorative Glow */}
      <View style={styles.topGlow} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={THEME.textWhite} />
        </TouchableOpacity>
        
        <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>MY COUPONS</Text>
             <Text style={styles.headerSubtitle}>
               {coupons.length > 0 ? `${coupons.length} Available` : 'No coupons'}
             </Text>
        </View>
        
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
                <View style={styles.emptyIconContainer}>
                    <Icon name="ticket-outline" size={50} color={THEME.textPlaceholder} />
                </View>
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
    backgroundColor: THEME.background,
  },
  topGlow: {
    position: 'absolute',
    top: -100,
    left: -50,
    width: width,
    height: 300,
    backgroundColor: THEME.accent,
    opacity: 0.05,
    borderRadius: 150,
    transform: [{ scaleX: 1.5 }],
  },
  // Header
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
    borderRadius: 20, // Circular
    backgroundColor: 'rgba(255,255,255,0.1)', // Glassmorphism
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitleContainer: {
      alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.textWhite,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  headerSubtitle: {
      fontSize: 12,
      color: THEME.textGray,
      marginTop: 2,
  },
  placeholder: {
    width: 40,
  },
  // List & Item
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  emptyContainer: {
    marginTop: 80,
    alignItems: 'center',
    padding: 20,
  },
  emptyIconContainer: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: 'rgba(255,255,255,0.03)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.05)',
  },
  emptyText: {
    color: THEME.textGray,
    fontSize: 16,
    fontWeight: '500',
  },
  couponCard: {
    borderRadius: 20,
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  couponMainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 15,
  },
  discountSection: {
    alignItems: 'center',
    paddingRight: 15,
    minWidth: 80,
  },
  discountAmount: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 4,
  },
  discountLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  separator: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginRight: 15,
  },
  couponInfo: {
    flex: 1,
  },
  couponCode: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  couponDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 8,
  },
  expiryContainer: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  expiryDate: {
    fontSize: 12,
  },
  couponFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  applyButton: {
    backgroundColor: THEME.accent,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20, // Pill shape
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default CouponListScreen;