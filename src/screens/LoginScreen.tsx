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

import { required, isEmail } from '../utils/validators';
import { login } from '../services/AuthService';
import { checkErrorFetchingData, showToast } from '../utils/function';
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
      const apiResponse = await login(loginRequest);
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
      <StatusBar barStyle="light-content" backgroundColor="#2F2F2F" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          {errors.email && (
            <Text style={styles.error}>{errors.email.message}</Text>
          )}
          <View style={styles.form}>
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
                    placeholderTextColor="#C5C5C5"
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

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPasswordScreen')}
              style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}>
              <Text style={styles.loginButtonText}>Sign In</Text>
            </TouchableOpacity>

            {/* <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity style={styles.socialButton}>
              <Icon name="logo-google" size={20} color="#FFFFFF" />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton}>
              <Icon name="logo-facebook" size={20} color="#FFFFFF" />
              <Text style={styles.socialButtonText}>
                Continue with Facebook
              </Text>
            </TouchableOpacity> */}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('RegisterScreen')}>
              <Text style={styles.signUpText}>Sign Up</Text>
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
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
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
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#FF8133',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#FF8133',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#3D3D3D',
  },
  dividerText: {
    color: '#C5C5C5',
    marginHorizontal: 16,
    fontSize: 14,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3D3D3D',
    borderRadius: 12,
    height: 56,
    marginBottom: 12,
  },
  socialButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#C5C5C5',
    fontSize: 16,
  },
  signUpText: {
    color: '#FF8133',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {color: 'red', marginBottom: 10},
});

export default LoginScreen;
