/* eslint-disable react-hooks/exhaustive-deps */
import {useCallback, useState} from 'react';
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
import { resetPassword, resendResetPasswordCode } from '../services/AuthService';
import { showToast, checkErrorFetchingData } from '../utils/function';


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
      <StatusBar barStyle="light-content" backgroundColor="#2F2F2F" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              We've sent a verification code to {email}
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Icon
                name="shield-checkmark-outline"
                size={20}
                color="#C5C5C5"
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
                    placeholderTextColor="#C5C5C5"
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
                Didn't receive code? Resend
              </Text>
            </TouchableOpacity>

            {errors.password && (
              <Text style={styles.error}>{errors.password.message}</Text>
            )}
            <View style={styles.inputContainer}>
              <Icon
                name="lock-closed-outline"
                size={20}
                color="#C5C5C5"
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
                    placeholderTextColor="#C5C5C5"
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
                  color="#C5C5C5"
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
                color="#C5C5C5"
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
                    placeholderTextColor="#C5C5C5"
                    secureTextEntry={!showConfirmPassword}
                    value={field.value}
                    onChangeText={field.onChange}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}>
                <Icon
                  name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#C5C5C5"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}>
              <Text style={styles.resetButtonText}>Reset Password</Text>
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
    backgroundColor: '#2F2F2F',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 30,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 24,
    zIndex: 1,
    padding: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#C5C5C5',
    textAlign: 'center',
    lineHeight: 24,
  },
  form: {
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3D3D3D',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: '#3D3D3D',
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  sendButton: {
    backgroundColor: '#FF8133',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#FF8133',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  resendCode: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  resendCodeText: {
    color: '#FF8133',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: 40,
  },
  footerText: {
    color: '#C5C5C5',
    fontSize: 16,
  },
  signInText: {
    color: '#FF8133',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: '#FF4444',
    marginBottom: 10,
    fontSize: 14,
  },
});
