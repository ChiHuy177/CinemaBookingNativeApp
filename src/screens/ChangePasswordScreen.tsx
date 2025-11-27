/* eslint-disable react-hooks/exhaustive-deps */
import {useCallback, useState} from 'react';
import {ChangePasswordScreenProps} from '../types/screentypes';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {matchPassword, required, strongPassword} from '../utils/validators';
import {useSpinner} from '../context/SpinnerContext';
import {SafeAreaView} from 'react-native-safe-area-context';
import {changePasswordClient} from '../services/ClientService';
import {ChangePasswordProfileProps} from '../types/client';
import {showToast, checkErrorFetchingData} from '../utils/function';

const { width } = Dimensions.get('window');

// THEME CONSTANTS MATCHING LOGIN & REGISTER
const THEME = {
  background: '#10111D', // Dark cinematic background
  cardBg: '#1F2130',     // Input/Card background
  accent: '#FF3B30',     // Bright Red/Coral accent
  textWhite: '#FFFFFF',
  textGray: '#8F90A6',   // Muted gray
  textPlaceholder: '#5C5E6F',
  error: '#FF3B30',
};

export const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({
  navigation,
  route,
}) => {
  const {email} = route.params;

  const [showCurrentPassword, setShowCurrentPassword] =
    useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] =
    useState<boolean>(false);

  const {
    control,
    formState: {errors, isSubmitting},
    handleSubmit,
    getValues,
  } = useForm<ChangePasswordProfileProps>({
    defaultValues: {
      email: email,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const {hideSpinner, showSpinner} = useSpinner();

  const onSubmit: SubmitHandler<ChangePasswordProfileProps> = useCallback(
    async data => {
      try {
        showSpinner();
        const responseData = await changePasswordClient(data);
        showToast({
          type: responseData.code === 1000 ? 'success' : 'error',
          text1: responseData.result,
        });
        if (responseData.code === 1000) {
            navigation.goBack();
        }
      } catch (error) {
        checkErrorFetchingData({
          error: error,
          title: 'Error resetting password',
        });
      } finally {
        hideSpinner();
      }
    },
    [navigation, showSpinner, hideSpinner],
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.background} />
      
      {/* Decorative Glow */}
      <View style={styles.topGlow} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <Icon name="arrow-back" size={24} color={THEME.textWhite} />
            </TouchableOpacity>
            
            <View style={styles.headerTitleContainer}>
                 <Text style={styles.headerTitle}>CHANGE PASSWORD</Text>
                 <Text style={styles.subTitle}>
                  Create a new password to secure your account
                </Text>
            </View>
          </View>

          <View style={styles.form}>
            {/* Current Password */}
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Current Password</Text>
                <View style={[styles.inputContainer, errors.currentPassword && styles.inputError]}>
                    <Icon
                    name="lock-closed"
                    size={20}
                    color={errors.currentPassword ? THEME.error : THEME.textPlaceholder}
                    style={styles.inputIcon}
                    />
                    <Controller
                    control={control}
                    name="currentPassword"
                    rules={{
                        ...required('Current password is required'),
                        ...strongPassword,
                    }}
                    render={({field}) => (
                        <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        placeholderTextColor={THEME.textPlaceholder}
                        secureTextEntry={!showCurrentPassword}
                        value={field.value}
                        onChangeText={field.onChange}
                        autoCapitalize="none"
                        autoCorrect={false}
                        />
                    )}
                    />
                    <TouchableOpacity
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                    style={styles.eyeIcon}>
                    <Icon
                        name={showCurrentPassword ? 'eye' : 'eye-off'}
                        size={20}
                        color={THEME.textPlaceholder}
                    />
                    </TouchableOpacity>
                </View>
                {errors.currentPassword && (
                <Text style={styles.error}>{errors.currentPassword.message}</Text>
                )}
            </View>

            {/* New Password */}
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>New Password</Text>
                <View style={[styles.inputContainer, errors.newPassword && styles.inputError]}>
                    <Icon
                    name="lock-closed"
                    size={20}
                    color={errors.newPassword ? THEME.error : THEME.textPlaceholder}
                    style={styles.inputIcon}
                    />
                    <Controller
                    control={control}
                    name="newPassword"
                    rules={{
                        ...required('New password is required'),
                        ...strongPassword,
                    }}
                    render={({field}) => (
                        <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        placeholderTextColor={THEME.textPlaceholder}
                        secureTextEntry={!showNewPassword}
                        value={field.value}
                        onChangeText={field.onChange}
                        autoCapitalize="none"
                        autoCorrect={false}
                        />
                    )}
                    />
                    <TouchableOpacity
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    style={styles.eyeIcon}>
                    <Icon
                        name={showNewPassword ? 'eye' : 'eye-off'}
                        size={20}
                        color={THEME.textPlaceholder}
                    />
                    </TouchableOpacity>
                </View>
                {errors.newPassword && (
                <Text style={styles.error}>{errors.newPassword.message}</Text>
                )}
            </View>

            {/* Confirm New Password */}
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>Confirm New Password</Text>
                <View style={[styles.inputContainer, errors.confirmNewPassword && styles.inputError]}>
                    <Icon
                    name="lock-closed"
                    size={20}
                    color={errors.confirmNewPassword ? THEME.error : THEME.textPlaceholder}
                    style={styles.inputIcon}
                    />
                    <Controller
                    control={control}
                    name="confirmNewPassword"
                    rules={{
                        ...required('Please confirm your password'),
                        ...strongPassword,
                        ...matchPassword(getValues, 'newPassword'),
                    }}
                    render={({field}) => (
                        <TextInput
                        style={styles.input}
                        placeholder="••••••••"
                        placeholderTextColor={THEME.textPlaceholder}
                        secureTextEntry={!showConfirmNewPassword}
                        value={field.value}
                        onChangeText={field.onChange}
                        autoCapitalize="none"
                        autoCorrect={false}
                        />
                    )}
                    />
                    <TouchableOpacity
                    onPress={() =>
                        setShowConfirmNewPassword(!showConfirmNewPassword)
                    }
                    style={styles.eyeIcon}>
                    <Icon
                        name={
                        showConfirmNewPassword ? 'eye' : 'eye-off'
                        }
                        size={20}
                        color={THEME.textPlaceholder}
                    />
                    </TouchableOpacity>
                </View>
                {errors.confirmNewPassword && (
                <Text style={styles.error}>
                    {errors.confirmNewPassword.message}
                </Text>
                )}
            </View>

            <TouchableOpacity
              style={[styles.resetButton, isSubmitting && styles.resetButtonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}>
               {isSubmitting ? (
                 <Text style={styles.resetButtonText}>Updating...</Text>
               ) : (
                <>
                  <Text style={styles.resetButtonText}>Update Password</Text>
                  <Icon name="checkmark-circle" size={20} color="#FFF" style={{marginLeft: 8}} />
                </>
               )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  
  // Header Styles
  header: {
    marginBottom: 30,
    marginTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)', // Circle back button
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitleContainer: {
      marginBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: THEME.textWhite,
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  subTitle: {
    fontSize: 14,
    color: THEME.textGray,
    lineHeight: 22,
  },

  // Form Styles
  form: {
    marginTop: 10,
  },
  inputWrapper: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: THEME.textWhite,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.cardBg,
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: THEME.error,
    borderWidth: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: THEME.textWhite,
    height: '100%',
  },
  eyeIcon: {
    padding: 8,
  },
  error: {
    color: THEME.error,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },

  // Button Styles
  resetButton: {
    backgroundColor: THEME.accent,
    borderRadius: 29, // Pill shape
    height: 58,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: THEME.accent,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  resetButtonDisabled: {
      opacity: 0.7,
      backgroundColor: '#3A3A3A',
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});