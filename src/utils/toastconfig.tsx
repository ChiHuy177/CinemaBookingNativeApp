import {StyleSheet, Text, View} from 'react-native';
import {ToastConfigParams} from 'react-native-toast-message';

export const toastConfig = {
  success: (props: ToastConfigParams<any>) => (
    <View style={styles.successToast}>
      <View style={styles.iconContainer}>
        <Text style={styles.successIcon}>✓</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.successTitle}>{props.text1}</Text>
        {props.text2 && (
          <Text style={styles.successMessage}>{props.text2}</Text>
        )}
      </View>
    </View>
  ),

  error: (props: ToastConfigParams<any>) => (
    <View style={styles.errorToast}>
      <View style={styles.iconContainer}>
        <Text style={styles.errorIcon}>✕</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.errorTitle}>{props.text1}</Text>
        {props.text2 && <Text style={styles.errorMessage}>{props.text2}</Text>}
      </View>
    </View>
  ),

  info: (props: ToastConfigParams<any>) => (
    <View style={styles.infoToast}>
      <View style={styles.iconContainer}>
        <Text style={styles.infoIcon}>ℹ</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.infoTitle}>{props.text1}</Text>
        {props.text2 && <Text style={styles.infoMessage}>{props.text2}</Text>}
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  baseToast: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  successToast: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#D4F8E8',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  errorToast: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#FEE2E2',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    shadowColor: '#EF4444',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  infoToast: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#DBEAFE',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  iconContainer: {
    marginRight: 12,
    width: 24,
    height: 24,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },

  successIcon: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#10B981',
  },

  errorIcon: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#EF4444',
  },

  infoIcon: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#3B82F6',
  },

  warningIcon: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#F59E0B',
  },

  textContainer: {
    flex: 1,
  },
  successTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#065F46',
    marginBottom: 2,
  },

  errorTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#B91C1C',
    marginBottom: 2,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#1E40AF',
    marginBottom: 2,
  },

  warningTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#92400E',
    marginBottom: 2,
  },

  customTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: 2,
  },

  successMessage: {
    fontSize: 14,
    color: '#047857',
  },

  errorMessage: {
    fontSize: 14,
    color: '#DC2626',
  },

  infoMessage: {
    fontSize: 14,
    color: '#2563EB',
  },

  warningMessage: {
    fontSize: 14,
    color: '#D97706',
  },

  customMessage: {
    fontSize: 14,
    color: '#6B7280',
  },

  toastImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
});
