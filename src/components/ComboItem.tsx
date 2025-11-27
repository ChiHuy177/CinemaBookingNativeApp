import React from 'react';
import {ComboProps, SelectedComboProps} from '../types/combo';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {colors} from '../constants/colors';
import {getComboImgae} from '../utils/functions';
export const ComboItem = React.memo(
  ({
    combo,
    updateQuantity,
    selectedCombos,
  }: {
    combo: ComboProps;
    updateQuantity: (selectedCombo: ComboProps, change: number) => void;
    selectedCombos: SelectedComboProps[];
  }) => {
    const selectedCombo = selectedCombos.find(
      eachSelectedCombo => eachSelectedCombo.combo.comboId === combo.comboId,
    );
    return (
      <View
        key={combo.comboId}
        style={[styles.comboCard, selectedCombo && styles.selectedComboCard]}>
        <View style={styles.imageContainer}>
          <Image
            source={{uri: getComboImgae(combo.imageURL)}}
            style={styles.comboImage}
          />
        </View>

        <View style={styles.comboInfo}>
          <Text style={styles.comboName}>{combo.name}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.comboPrice}>
              {combo.price.toLocaleString('vi-VN') + 'đ'}
            </Text>
            <Text style={styles.stockText}>Còn: {combo.quantity}</Text>
          </View>

          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={[
                styles.quantityButton,
                !selectedCombo && styles.disabledButton,
              ]}
              onPress={() => updateQuantity(combo, -1)}
              disabled={!selectedCombo}>
              <Icon name="remove" size={20} color={colors.white} />
            </TouchableOpacity>

            <Text style={styles.quantityText}>
              {selectedCombo ? selectedCombo.quantity : 0}
            </Text>

            <TouchableOpacity
              style={[
                styles.quantityButton,
                (selectedCombo?.quantity || 0) >= combo.quantity &&
                  styles.disabledButton,
              ]}
              onPress={() => updateQuantity(combo, 1)}
              disabled={(selectedCombo?.quantity || 0) >= combo.quantity}>
              <Icon name="add" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  comboCard: {
    backgroundColor: colors.mediumGray,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedComboCard: {
    borderColor: colors.primary,
  },
  disabledComboCard: {
    opacity: 0.6,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  comboImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  soldOutOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldOutText: {
    color: colors.red,
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  comboInfo: {
    padding: 20,
  },
  comboName: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  comboDescription: {
    color: colors.lightGray,
    fontSize: 14,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  comboPrice: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  stockText: {
    color: colors.lightGray,
    fontSize: 14,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.dark,
    borderRadius: 8,
    padding: 8,
  },
  quantityButton: {
    backgroundColor: colors.primary,
    borderRadius: 6,
    padding: 8,
    minWidth: 36,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  quantityText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
    minWidth: 40,
    textAlign: 'center',
  },
});
