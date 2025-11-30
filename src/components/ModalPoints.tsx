/* eslint-disable react-hooks/exhaustive-deps */
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {Icon} from 'react-native-paper';
import React, {useCallback, useMemo, useState} from 'react';
import {useSpinner} from '../context/SpinnerContext';


import {getEmailAndToken} from '../utils/storage';
import {useFocusEffect} from '@react-navigation/native';
import { colors } from '../constant/color';
import { getLoyalPoints } from '../services/ClientService';
import { showToast, checkErrorFetchingData } from '../utils/function';

const {width, height} = Dimensions.get('window');

const ModalPoint = React.memo(
  ({
    pointsModalVisible,
    hideModal,
    slideAnim,
    usedPoints,
    setUsedPoints,
    totalWithOutPoints,
  }: {
    pointsModalVisible: boolean;
    hideModal: () => void;
    slideAnim: Animated.Value;
    usedPoints: number;
    setUsedPoints: React.Dispatch<React.SetStateAction<number>>;
    totalWithOutPoints: number;
  }) => {
    const [userPoints, setUserPoints] = useState<number>(0);

    const {hideSpinner, showSpinner} = useSpinner();

    const maximumPoints = useMemo(() => {
      return Math.min(userPoints, totalWithOutPoints + usedPoints);
    }, [userPoints, totalWithOutPoints, usedPoints]);

    useFocusEffect(
      useCallback(() => {
        let isActive = true;
        async function fetchingUserPoints() {
          try {
            showSpinner();
            const emailAndToken = await getEmailAndToken();

            const responseData = await getLoyalPoints(
              emailAndToken?.email || '',
            );

            if (responseData.code === 1000 && isActive) {
              setUserPoints(responseData.result);
            } else {
              showToast({
                type: 'error',
                text1: responseData.message,
              });
            }
          } catch (error) {
            checkErrorFetchingData({
              error: error,
              title: 'Error fetching points',
            });
          } finally {
            hideSpinner();
          }
        }

        fetchingUserPoints();

        return () => {
          isActive = false;
        };
      }, []),
    );

    return (
      <Modal
        visible={pointsModalVisible}
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
                Use Points:
              </Text>
              <TouchableOpacity onPress={hideModal} style={styles.closeButton}>
                <Icon source="close" size={24} color={colors.lightGray} />
              </TouchableOpacity>
            </View>

            <View style={styles.pointsInfo}>
              <Text style={[styles.pointsLabel, {color: colors.lightGray}]}>
                Current Points:
              </Text>
              <Text style={[styles.pointsValue, {color: colors.primary}]}>
                {userPoints.toLocaleString('vi-VN')} points
              </Text>
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
              placeholder="Enter points"
              placeholderTextColor={colors.lightGray}
              value={usedPoints.toString()}
              onChangeText={value => {
                const numericValue = value.replace(/[^0-9]/g, '');
                const max = Math.min(maximumPoints, Number(numericValue));
                setUsedPoints(max);
              }}
              keyboardType="numeric"
            />

            <Text style={[styles.pointsNote, {color: colors.lightGray}]}>
              1 point = 1đ. Maximum {maximumPoints.toLocaleString('vi-VN')}{' '}
              points
            </Text>

            <TouchableOpacity
              style={[styles.modalButton, {backgroundColor: colors.primary}]}
              onPress={() => hideModal()}
              activeOpacity={0.8}>
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
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 10,
  },
  pointsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  pointsLabel: {
    fontSize: 16,
  },
  pointsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  pointsNote: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default ModalPoint;
