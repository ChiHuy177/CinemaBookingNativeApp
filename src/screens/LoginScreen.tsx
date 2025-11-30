/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {LoginScreenProps} from '../types/screentypes';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {useSpinner} from '../context/SpinnerContext';
import {useAuth} from '../context/AuthContext';
import {saveEmailAndToken} from '../utils/storage';
import {SafeAreaView} from 'react-native-safe-area-context';

import {required, isEmail} from '../utils/validators';
import {login} from '../services/AuthService';
import {checkErrorFetchingData, showToast} from '../utils/function';

const { width } = Dimensions.get('window');

interface FormData {
  email: string;
  password: string;
}

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const {
    control,
    formState: {errors, isSubmitting},
    handleSubmit,
  } = useForm<FormData>();

  const [showPassword, setShowPassword] = useState(false);
  const {showSpinner, hideSpinner} = useSpinner();
  const {saveAuth} = useAuth();

  const onSubmit: SubmitHandler<FormData> = useCallback(async data => {
    try {
      const loginRequest = {
        email: data.email,
        password: data.password,
      };

      showSpinner();
      console.log('Sending login request:', loginRequest.email);
      const apiResponse = await login(loginRequest);
      console.log('API response received.');

      if (apiResponse.result.authenticated) {
        saveEmailAndToken({
          email: apiResponse.result.email,
          token: apiResponse.result.token,
        });
        saveAuth();
        showToast({
          type: 'success',
          text1: 'Success',
          text2: 'Login successful!',
        });
        // Navigate after a slight delay to allow the toast to show
        setTimeout(() => {
          navigation.navigate('MainTabs');
        }, 1500);
      } else {
        // Handle unauthenticated response from API even if status is 200
        showToast({
          type: 'error',
          text1: 'Login Error',
          text2: apiResponse.message || 'Incorrect email or password.',
        });
      }
    } catch (error: any) {
      console.log('Axios error during login:', JSON.stringify(error, null, 2));
      checkErrorFetchingData({
        error: error,
        title: 'Login Failed',
      });
    } finally {
      hideSpinner();
    }
  }, [navigation, saveAuth, showSpinner, hideSpinner]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#10111D" />
      
      {/* Decorative Background Elements based on reference style */}
      <View style={styles.topGlow} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          
          {/* HEADER SECTION */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Icon name="film-outline" size={40} color="#FF3B30" />
            </View>
            <Text style={styles.appName}>CINEMA TICKET</Text>
            <Text style={styles.welcomeText}>
              Welcome back, Let's book your movie!
            </Text>
          </View>

          {/* FORM SECTION */}
          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Email Address</Text>
              <View
                style={[
                  styles.inputContainer,
                  errors.email && styles.inputErrorBorder,
                ]}>
                <Icon
                  name="mail"
                  size={20}
                  color={errors.email ? '#FF3B30' : '#5C5E6F'}
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
                      placeholderTextColor="#5C5E6F"
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
                <Text style={styles.errorText}>
                  {errors.email.type === 'required'
                    ? 'Email is required'
                    : 'Invalid email address'}
                </Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Password</Text>
              <View
                style={[
                  styles.inputContainer,
                  errors.password && styles.inputErrorBorder,
                ]}>
                <Icon
                  name="lock-closed"
                  size={20}
                  color={errors.password ? '#FF3B30' : '#5C5E6F'}
                  style={styles.inputIcon}
                />
                <Controller
                  control={control}
                  name="password"
                  rules={{
                    ...required('Password is required'),
                  }}
                  render={({field}) => (
                    <TextInput
                      style={styles.input}
                      placeholder="••••••••"
                      placeholderTextColor="#5C5E6F"
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
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color="#5C5E6F"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password.message}</Text>
              )}
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPasswordScreen')}
              style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                isSubmitting && styles.loginButtonDisabled,
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}>
              {isSubmitting ? (
                <Text style={styles.loginButtonText}>Processing...</Text>
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Login</Text>
                  <Icon name="arrow-forward" size={20} color="#FFF" style={{marginLeft: 8}} />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
              <Text style={styles.signUpText}>Sign up now</Text>
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
    backgroundColor: '#10111D', // Dark cinematic background (Matched reference)
  },
  topGlow: {
    position: 'absolute',
    top: -100,
    left: -50,
    width: width,
    height: 300,
    backgroundColor: '#FF3B30',
    opacity: 0.08,
    borderRadius: 150,
    transform: [{ scaleX: 1.5 }],
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    justifyContent: 'center',
  },
  
  // Header Styles
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  welcomeText: {
    fontSize: 14,
    color: '#8F90A6',
    textAlign: 'center',
  },

  // Form Styles
  formContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2130', // Card color from reference
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputErrorBorder: {
    borderColor: '#FF3B30',
    borderWidth: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#FFFFFF',
    height: '100%',
  },
  eyeIcon: {
    padding: 8,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  forgotPasswordText: {
    color: '#FF3B30', // Accent color
    fontSize: 14,
    fontWeight: '600',
  },

  // Button Styles
  loginButton: {
    height: 58,
    borderRadius: 29, // Fully rounded (Pill shape)
    backgroundColor: '#FF3B30', // The bright red from the reference
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  loginButtonDisabled: {
    opacity: 0.7,
    backgroundColor: '#3A3A3A',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Footer Styles
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    alignItems: 'center',
  },
  footerText: {
    color: '#8F90A6',
    fontSize: 14,
  },
  signUpText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;