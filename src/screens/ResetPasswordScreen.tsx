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

// --- CINEMATIC DARK THEME CONFIGURATION ---
const THEME = {
  background: '#10111D', // Deep Cinematic Blue/Black
  cardBg: '#1C1D2E', // Slightly lighter panel
  primaryRed: '#FF3B30', // Neon/Cinematic Red
  inputBg: 'rgba(255, 255, 255, 0.05)', // Glassy input
  textWhite: '#FFFFFF',
  textGray: '#A0A0B0',
  textDarkGray: '#5C5D6F',
  glass: 'rgba(255, 255, 255, 0.08)',
  border: 'rgba(255, 255, 255, 0.05)',
  shadowColor: '#FF3B30',
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
            text1: 'Password Reset Successful',
            text2: responseData.message || 'You can now login with your new password.',
          });
          setTimeout(() => {
            navigation.navigate('LoginScreen');
          }, 2000);
        }
      } catch (error) {
        checkErrorFetchingData({
          error: error,
          title: 'Reset Failed',
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
          text1: 'Code Sent',
          text2: 'A new verification code has been sent to your email.',
        });
      }
    } catch (error) {
      checkErrorFetchingData({
        error: error,
        title: 'Error Resending Code',
      });
    } finally {
      hideSpinner();
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.background} />

      {/* Decorative Background Elements */}
      <View style={styles.bgGlowTop} />
      <View style={styles.bgGlowBottom} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.glassButton}
              onPress={() => navigation.goBack()}>
              <Icon name="chevron-back" size={24} color={THEME.textWhite} />
            </TouchableOpacity>
          </View>

          <View style={styles.titleSection}>
            <View style={styles.badge}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>Security Check</Text>
            </View>

            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              We've sent a 6-digit code to{' '}
              <Text style={styles.subtitleAccent}>{email}</Text>. Please enter it below to set a new password.
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            
            {/* Verification Code Input */}
            <View style={styles.inputWrapper}>
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
                      placeholder="Verification Code"
                      placeholderTextColor={THEME.textDarkGray}
                      keyboardType="number-pad"
                      value={field.value}
                      onChangeText={field.onChange}
                      style={styles.input}
                      maxLength={6}
                    />
                  )}
                />
              </View>
              {errors.code && (
                <Text style={styles.errorText}>{errors.code.message}</Text>
              )}
            </View>

            <TouchableOpacity
              onPress={() => resendCode(email)}
              style={styles.resendCode}
              activeOpacity={0.7}>
              <Text style={styles.resendCodeText}>
                Didn't receive it? <Text style={styles.resendCodeHighlight}>Resend Code</Text>
              </Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* New Password Input */}
            <View style={styles.inputWrapper}>
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
                        style={[styles.input, {paddingRight: 40}]}
                        placeholder="New Password"
                        placeholderTextColor={THEME.textDarkGray}
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
                {errors.password && (
                    <Text style={styles.errorText}>{errors.password.message}</Text>
                )}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputWrapper}>
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
                        style={[styles.input, {paddingRight: 40}]}
                        placeholder="Confirm New Password"
                        placeholderTextColor={THEME.textDarkGray}
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
                {errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
                )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              activeOpacity={0.8}>
              <Text style={styles.resetButtonText}>
                 {isSubmitting ? 'Processing...' : 'Reset Password'}
              </Text>
              <View style={styles.btnGlow} />
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
    paddingVertical: 20,
  },

  // Ambient Background
  bgGlowTop: {
    position: 'absolute',
    top: -100,
    left: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: THEME.primaryRed,
    opacity: 0.08,
    transform: [{ scaleX: 1.5 }],
  },
  bgGlowBottom: {
    position: 'absolute',
    bottom: -100,
    right: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: '#0055FF', // Subtle blue contrast
    opacity: 0.05,
  },

  // Header
  headerContainer: {
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  glassButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: THEME.glass,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.border,
  },

  // Title Section
  titleSection: {
    marginBottom: 30,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.2)',
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.primaryRed,
    marginRight: 8,
  },
  badgeText: {
    color: THEME.primaryRed,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: THEME.textWhite,
    marginBottom: 10,
    textShadowColor: 'rgba(255, 59, 48, 0.2)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 15,
    color: THEME.textGray,
    lineHeight: 24,
  },
  subtitleAccent: {
    color: THEME.textWhite,
    fontWeight: '600',
  },

  // Form Card
  formCard: {
    backgroundColor: THEME.cardBg,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: THEME.border,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  
  inputWrapper: {
      marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.inputBg,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 60,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: THEME.textWhite,
  },
  eyeIcon: {
    padding: 8,
  },
  errorText: {
    color: THEME.primaryRed,
    marginTop: 6,
    fontSize: 12,
    marginLeft: 4,
  },

  resendCode: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  resendCodeText: {
    color: THEME.textGray,
    fontSize: 13,
  },
  resendCodeHighlight: {
      color: THEME.primaryRed,
      fontWeight: '600',
  },

  divider: {
      height: 1,
      backgroundColor: THEME.border,
      marginVertical: 20,
      width: '100%',
  },

  // Button
  resetButton: {
    backgroundColor: THEME.primaryRed,
    height: 58,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: THEME.shadowColor,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  resetButtonText: {
    color: THEME.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  btnGlow: {
      position: 'absolute',
      top: -20,
      left: 20,
      width: 50,
      height: 100,
      backgroundColor: 'rgba(255,255,255,0.15)',
      transform: [{rotate: '20deg'}],
  }
});