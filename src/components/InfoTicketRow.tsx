import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import { colors } from '../constant/color';


export const InfoTicketRow = React.memo(
  ({
    label,
    value,
    isPrice = false,
  }: {
    label: string;
    value: number | string;
    isPrice?: boolean;
  }) => {
    return (
      <View style={styles.infoRow}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, isPrice && styles.priceText]}>
          {isPrice ? value.toLocaleString('vi-VN') + 'đ' : value}
        </Text>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  label: {
    color: colors.lightGray,
    fontSize: 14,
    flex: 1,
  },
  value: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
  },
  priceText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});
