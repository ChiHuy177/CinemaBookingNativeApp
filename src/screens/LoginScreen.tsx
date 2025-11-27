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
      console.log(loginRequest);
      const apiResponse = await login(loginRequest);
      console.log(apiResponse);
      if (apiResponse.result.authenticated) {
        saveEmailAndToken({
          email: apiResponse.result.email,
          token: apiResponse.result.token,
        });
        saveAuth();
        showToast({
          type: 'success',
          text1: 'Login Successfull!',
        });
        setTimeout(() => {
          navigation.navigate('MainTabs');
        }, 1500);
      }
    } catch (error: any) {
      console.log('Axios error:', JSON.stringify(error, null, 2));
      checkErrorFetchingData({
        error: error,
        title: 'Login Failed',
      });
    } finally {
      hideSpinner();
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#070816" />
      {/* fake gradient blobs */}
      <View style={styles.bgCircleTop} />
      <View style={styles.bgCircleBottom} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.badge}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>Cinema App</Text>
            </View>

            <Text style={styles.title}>Welcome back,</Text>
            <Text style={styles.subtitle}>
              <Text style={styles.subtitleBold}>Sign in</Text> to enjoy the
              latest movies
            </Text>
          </View>

          {/* FORM CARD */}
          <View style={styles.formCard}>
            {errors.email && (
              <Text style={styles.error}>{errors.email.message}</Text>
            )}
            <View style={styles.inputContainer}>
              <Icon
                name="mail-outline"
                size={20}
                color="#C5C5C5"
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
                    placeholder="Email"
                    placeholderTextColor="#8E8E93"
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
                }}
                render={({field}) => (
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Password"
                    placeholderTextColor="#8E8E93"
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

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPasswordScreen')}
              style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}>
              <View style={styles.loginButtonContent}>
                <Text style={styles.loginButtonText}>Sign in</Text>
                <Icon
                  name="arrow-forward"
                  size={18}
                  color="#FFFFFF"
                  style={styles.loginArrowIcon}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don&apos;t have an account?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('RegisterScreen')}>
              <Text style={styles.signUpText}> Sign up</Text>
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
    backgroundColor: '#070816', // dark cinema background
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'center',
  },

  /* fake gradient blobs */
  bgCircleTop: {
    position: 'absolute',
    top: -120,
    left: -60,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#20213A',
    opacity: 0.9,
  },
  bgCircleBottom: {
    position: 'absolute',
    bottom: -140,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#FF4B3A',
    opacity: 0.25,
  },

  header: {
    marginBottom: 32,
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
    backgroundColor: '#FF4B3A',
    marginRight: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#B0B0B5',
    lineHeight: 22,
  },
  subtitleBold: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  formCard: {
    backgroundColor: 'rgba(12, 11, 23, 0.96)',
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 18},
    shadowOpacity: 0.45,
    shadowRadius: 30,
    elevation: 16,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#FFFFFF',
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },

  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#FF4B3A',
    fontSize: 13,
    fontWeight: '600',
  },

  loginButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: '#FF4B3A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF4B3A',
    shadowOffset: {width: 0, height: 12},
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 10,
  },
  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  loginArrowIcon: {
    marginLeft: 8,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#8E8E93',
    fontSize: 14,
  },
  signUpText: {
    color: '#FF4B3A',
    fontSize: 14,
    fontWeight: '700',
  },

  error: {
    color: '#FF6B6B',
    marginBottom: 6,
    fontSize: 12,
  },
});

export default LoginScreen;
