/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useState} from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Icon} from 'react-native-paper';
import {colors} from '../constants/colors';
import {CouponProps} from '../types/coupon';
import {useSpinner} from '../context/SpinnerContext';
import {
  checkErrorFetchingData,
  formatDate,
  showToast,
} from '../utils/functions';
import {getEmailAndToken} from '../utils/storage';
import {getCouponsByClient} from '../api/services/coupon.service';
import {useFocusEffect} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const ModalCoupon = React.memo(
  ({
    couponModalVisible,
    hideModal,
    slideAnim,
    coupon,
    setCoupon,
  }: {
    couponModalVisible: boolean;
    hideModal: () => void;
    slideAnim: Animated.Value;
    coupon: CouponProps | null;
    setCoupon: React.Dispatch<React.SetStateAction<CouponProps | null>>;
  }) => {
    const [availableCoupons, setAvailableCoupons] = useState<CouponProps[]>([]);

    const {showSpinner, hideSpinner} = useSpinner();

    useFocusEffect(
      useCallback(() => {
        let isActive = true;
        async function fetchingCoupons() {
          try {
            showSpinner();
            const emailAndToken = await getEmailAndToken();
            const responseData = await getCouponsByClient(
              emailAndToken?.email || '',
            );

            if (responseData.code === 1000 && isActive) {
              setAvailableCoupons(responseData.result);
            } else {
              showToast({
                type: 'error',
                text1: responseData.message,
              });
            }
          } catch (error) {
            checkErrorFetchingData({
              error: error,
              title: 'Error fetching coupons',
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

    return (
      <Modal
        visible={couponModalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={hideModal}>
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.mediumGray,
                transform: [{translateX: slideAnim}],
              },
            ]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, {color: colors.white}]}>
                Enter coupon code
              </Text>
              <TouchableOpacity onPress={hideModal} style={styles.closeButton}>
                <Icon source="close" size={24} color={colors.lightGray} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[
                styles.modalInput,
                {
                  backgroundColor: colors.dark,
                  color: colors.white,
                  borderColor: colors.lightGray,
                },
              ]}
              placeholder="Pick your coupon"
              placeholderTextColor={colors.lightGray}
              value={coupon?.code}
              editable={false}
              autoCapitalize="characters"
            />

            <ScrollView
              style={styles.availableCoupons}
              showsVerticalScrollIndicator={false}>
              <Text style={[styles.modalSubtitle, {color: colors.lightGray}]}>
                Your Coupons:
              </Text>

              {availableCoupons.map(eachCoupon => (
                <TouchableOpacity
                  key={eachCoupon.code}
                  style={[styles.couponItem, {backgroundColor: colors.dark}]}
                  onPress={() => setCoupon(eachCoupon)}
                  activeOpacity={0.7}>
                  <Text style={[styles.couponCode, {color: colors.primary}]}>
                    {eachCoupon.code}
                  </Text>
                  <Text style={[styles.couponCode, {color: colors.primary}]}>
                    {eachCoupon.discountAmount.toLocaleString('vi-VN') + 'đ'}
                  </Text>
                  <Text style={[styles.couponDesc, {color: colors.white}]}>
                    {formatDate(new Date(eachCoupon.expiryDate))}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[styles.modalButton, {backgroundColor: colors.primary}]}
              activeOpacity={0.8}
              onPress={() => hideModal()}>
              <Text style={[styles.modalButtonText, {color: colors.white}]}>
                Apply
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    );
  },
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  modalContent: {
    width: width * 0.85,
    height: height,
    padding: 20,
    paddingTop: 50,
    paddingBottom: 50,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  availableCoupons: {
    flex: 1,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  couponItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  couponCode: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  couponDesc: {
    fontSize: 14,
  },
});

export default ModalCoupon;
