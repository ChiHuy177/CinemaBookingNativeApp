/* eslint-disable react-hooks/exhaustive-deps */
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {ForgotPasswordScreenProps} from '../types/screentypes';
import React, {useCallback} from 'react';
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
import {isEmail, required} from '../utils/validators';
import {useSpinner} from '../context/SpinnerContext';
import {SafeAreaView} from 'react-native-safe-area-context';
import {sendResetPasswordCode} from '../services/AuthService';
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

interface FormData {
  email: string;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<FormData>();

  const {showSpinner, hideSpinner} = useSpinner();

  const onSubmit: SubmitHandler<FormData> = useCallback(
    async data => {
      try {
        showSpinner();
        const responseData = await sendResetPasswordCode(data.email);
        if (responseData.code === 1000) {
          showToast({
            type: 'success',
            text1: 'Success',
            text2: 'Verification code sent successfully!',
          });
          setTimeout(() => {
            navigation.navigate('ResetPasswordScreen', {
              email: data.email,
            });
          }, 2000);
        }
      } catch (error) {
        checkErrorFetchingData({
          error: error,
          title: 'Error sending verification code',
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
              onPress={() => navigation.goBack()} 
              style={styles.backButton}
            >
               <Icon name="arrow-back" size={24} color={THEME.textWhite} />
            </TouchableOpacity>
            
            <View style={styles.headerIconContainer}>
               <Icon name="lock-open-outline" size={40} color={THEME.accent} />
            </View>
            
            <Text style={styles.title}>FORGOT PASSWORD</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we will send you a verification code to reset your password.
            </Text>
          </View>

          {/* FORM */}
          <View style={styles.form}>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Email Address</Text>
              <View
                style={[
                  styles.inputContainer,
                  errors.email && styles.inputError,
                ]}>
                <Icon
                  name="mail"
                  size={20}
                  color={errors.email ? THEME.error : THEME.textPlaceholder}
                  style={styles.inputIcon}
                />
                <Controller
                  control={control}
                  name="email"
                  rules={{
                    ...required('Email is required'),
                    ...isEmail,
                  }}
                  render={({field}) => (
                    <TextInput
                      placeholder="example@gmail.com"
                      placeholderTextColor={THEME.textPlaceholder}
                      keyboardType="email-address"
                      value={field.value}
                      onChangeText={field.onChange}
                      style={styles.input}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  )}
                />
              </View>
              {errors.email && (
                <Text style={styles.error}>{errors.email.message}</Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.sendButton, isSubmitting && styles.disabledButton]}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}>
               {isSubmitting ? (
                 <Text style={styles.sendButtonText}>Sending...</Text>
               ) : (
                 <Text style={styles.sendButtonText}>Send Verification Code</Text>
               )}
            </TouchableOpacity>
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Remember password? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.signInText}>Log In</Text>
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
  backButton: {
    alignSelf: 'flex-start',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: THEME.textWhite,
    marginBottom: 12,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: THEME.textGray,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  form: {
    marginBottom: 40,
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
  error: {
    color: THEME.error,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  
  // BUTTON STYLES
  sendButton: {
    backgroundColor: THEME.accent,
    borderRadius: 29, // Fully rounded
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: THEME.accent,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: '#3A3A3A',
    shadowOpacity: 0,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  
  // FOOTER STYLES
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    color: THEME.textGray,
    fontSize: 14,
  },
  signInText: {
    color: THEME.textWhite,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
    textDecorationLine: 'underline',
  },
});