/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useState} from 'react';
import {ResetPasswordScreenProps} from '../types/screentypes';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {ResetPasswordProps} from '../types/auth';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {matchPassword, required, strongPassword} from '../utils/validators';
import {useSpinner} from '../context/SpinnerContext';
import {SafeAreaView} from 'react-native-safe-area-context';
import {resetPassword, resendResetPasswordCode} from '../services/AuthService';
import {showToast, checkErrorFetchingData} from '../utils/function';

// THEME CONSTANTS EXTRACTED FROM IMAGE
const THEME = {
  background: '#13141F', // Dark blue-black background
  primaryRed: '#F54B64', // Coral red
  cardBg: '#20212D',     // Slightly lighter for cards
  inputBg: '#2A2C3A',    // Input background
  textWhite: '#FFFFFF',
  textGray: '#8F9BB3',   // Muted blue-gray text
  borderColor: 'rgba(255,255,255,0.08)',
};

export const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  navigation,
  route,
}) => {
  const {email} = route.params;
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const {
    control,
    formState: {errors, isSubmitting},
    handleSubmit,
    getValues,
  } = useForm<ResetPasswordProps>({
    defaultValues: {
      email: email,
      code: '',
      password: '',
      confirmPassword: '',
    },
  });

  const {hideSpinner, showSpinner} = useSpinner();

  const onSubmit: SubmitHandler<ResetPasswordProps> = useCallback(
    async data => {
      try {
        showSpinner();
        const responseData = await resetPassword({
          code: data.code,
          email: data.email,
          newPassword: data.password,
          confirmNewPassword: data.confirmPassword,
        });
        if (responseData.code === 1000) {
          showToast({
            type: 'success',
            text1: `${responseData.message}`,
          });
          setTimeout(() => {
            navigation.navigate('LoginScreen');
          }, 2000);
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
    [],
  );

  const resendCode = useCallback(async (inputEmail: string) => {
    try {
      showSpinner();
      const responseData = await resendResetPasswordCode(inputEmail);
      if (responseData.code === 1000) {
        showToast({
          type: 'success',
          text1: 'Verification code resent successfully',
        });
      }
    } catch (error) {
      checkErrorFetchingData({
        error: error,
        title: 'Error resending verification code',
      });
    } finally {
      hideSpinner();
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.background} />

      {/* Decorative Background Blobs */}
      <View style={styles.bgCircleTop} />
      <View style={styles.bgCircleBottom} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          {/* HEADER */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <Icon name="chevron-back" size={24} color={THEME.textWhite} />
            </TouchableOpacity>
          </View>

          <View style={styles.header}>
            <View style={styles.badge}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>Cinema App</Text>
            </View>

            <Text style={styles.title}>Reset password</Text>
            <Text style={styles.subtitle}>
              We&apos;ve sent a verification code to{' '}
              <Text style={styles.subtitleAccent}>{email}</Text>
            </Text>
          </View>

          {/* FORM CARD */}
          <View style={styles.formCard}>
            <View style={styles.inputContainer}>
              <Icon
                name="shield-checkmark-outline"
                size={20}
                color={THEME.textGray}
                style={styles.inputIcon}
              />
              <Controller
                control={control}
                name="code"
                rules={{
                  ...required('Verification code is required'),
                }}
                render={({field}) => (
                  <TextInput
                    placeholder="Enter verification code"
                    placeholderTextColor={THEME.textGray}
                    keyboardType="numeric"
                    value={field.value}
                    onChangeText={field.onChange}
                    style={styles.input}
                    maxLength={6}
                  />
                )}
              />
            </View>
            {errors.code && (
              <Text style={styles.error}>{errors.code.message}</Text>
            )}

            <TouchableOpacity
              onPress={() => resendCode(email)}
              style={styles.resendCode}>
              <Text style={styles.resendCodeText}>
                Didn&apos;t receive code? Resend
              </Text>
            </TouchableOpacity>

            {errors.password && (
              <Text style={styles.error}>{errors.password.message}</Text>
            )}
            <View style={styles.inputContainer}>
              <Icon
                name="lock-closed-outline"
                size={20}
                color={THEME.textGray}
                style={styles.inputIcon}
              />
              <Controller
                control={control}
                name="password"
                rules={{
                  ...required('Password is required'),
                  ...strongPassword,
                }}
                render={({field}) => (
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="New password"
                    placeholderTextColor={THEME.textGray}
                    secureTextEntry={!showPassword}
                    value={field.value}
                    onChangeText={field.onChange}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}>
                <Icon
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color={THEME.textGray}
                />
              </TouchableOpacity>
            </View>

            {errors.confirmPassword && (
              <Text style={styles.error}>{errors.confirmPassword.message}</Text>
            )}
            <View style={styles.inputContainer}>
              <Icon
                name="lock-closed-outline"
                size={20}
                color={THEME.textGray}
                style={styles.inputIcon}
              />
              <Controller
                control={control}
                name="confirmPassword"
                rules={{
                  ...required('Please confirm your password'),
                  ...strongPassword,
                  ...matchPassword(getValues, 'password'),
                }}
                render={({field}) => (
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Confirm new password"
                    placeholderTextColor={THEME.textGray}
                    secureTextEntry={!showConfirmPassword}
                    value={field.value}
                    onChangeText={field.onChange}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}
              />
              <TouchableOpacity
                onPress={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                style={styles.eyeIcon}>
                <Icon
                  name={
                    showConfirmPassword ? 'eye-outline' : 'eye-off-outline'
                  }
                  size={20}
                  color={THEME.textGray}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}>
              <Text style={styles.resetButtonText}>Reset password</Text>
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
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },

  // background blobs
  bgCircleTop: {
    position: 'absolute',
    top: -120,
    left: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: THEME.cardBg,
    opacity: 0.8,
  },
  bgCircleBottom: {
    position: 'absolute',
    bottom: -140,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: THEME.primaryRed,
    opacity: 0.15,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: THEME.cardBg,
  },
  header: {
    marginBottom: 24,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  badgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.primaryRed,
    marginRight: 8,
  },
  badgeText: {
    color: THEME.textWhite,
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: THEME.textWhite,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: THEME.textGray,
    lineHeight: 22,
  },
  subtitleAccent: {
    color: THEME.textWhite,
    fontWeight: '600',
  },

  formCard: {
    backgroundColor: THEME.cardBg,
    borderRadius: 24,
    padding: 22,
    marginTop: 8,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 18},
    shadowOpacity: 0.25,
    shadowRadius: 30,
    elevation: 5,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.inputBg,
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: THEME.borderColor,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: THEME.textWhite,
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },

  resetButton: {
    backgroundColor: THEME.primaryRed,
    borderRadius: 18,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: THEME.primaryRed,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  resetButtonText: {
    color: THEME.textWhite,
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  resendCode: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  resendCodeText: {
    color: THEME.primaryRed,
    fontSize: 14,
    fontWeight: '600',
  },

  error: {
    color: '#FF453A',
    marginBottom: 8,
    fontSize: 12,
    marginLeft: 5,
  },
});