/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';
import { RegisterScreenProps } from '../types/screentypes';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import {
  isEmail,
  isPhoneNumber,
  matchPassword,
  required,
  strongPassword,
} from '../utils/validators';
import { Dropdown } from 'react-native-element-dropdown';
import { useSpinner } from '../context/SpinnerContext';
import { RegisterRequest } from '../types/auth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { register } from '../services/AuthService';
import {
  getCitiesAPI,
  checkErrorFetchingData,
  showToast,
  formatDateOfBirth,
} from '../utils/function';

const { width } = Dimensions.get('window');

// THEME CONSTANTS MATCHING LOGIN SCREEN
const THEME = {
  background: '#10111D', // Dark cinematic background
  cardBg: '#1F2130',     // Input/Card background
  accent: '#FF3B30',     // Bright Red/Coral accent
  textWhite: '#FFFFFF',
  textGray: '#8F90A6',   // Muted gray
  textPlaceholder: '#5C5E6F',
  error: '#FF3B30',
};

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    getValues,
    setValue,
  } = useForm<RegisterRequest>();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [cities, setCities] = useState([]);
  const { showSpinner, hideSpinner } = useSpinner();

  useFocusEffect(
    useCallback(() => {
      setValue('genre', true);
      async function getAllCities() {
        try {
          const cityOptions = await getCitiesAPI();
          setCities(cityOptions);
        } catch (error) {
          checkErrorFetchingData({
            error: error,
            title: 'Error fetching cities',
          });
        }
      }

      getAllCities();
    }, []),
  );

  const onSubmit: SubmitHandler<RegisterRequest> = useCallback(async data => {
    try {
      showSpinner();
      const responseData = await register(data);
      if (responseData.code === 1000) {
        showToast({
          type: 'success',
          text1: 'Success',
          text2: `Register successfully!`,
        });
        // Optional: Navigate to login after success
        setTimeout(() => navigation.navigate('LoginScreen'), 1000);
      }
    } catch (error: any) {
      // console.error(error.r)
      checkErrorFetchingData({
        error,
        title: 'Register Failed',
      });
    } finally {
      hideSpinner();
    }
  }, [navigation, showSpinner, hideSpinner]);

  const renderInput = (
    name: keyof RegisterRequest,
    placeholder: string,
    icon: string,
    rules: any,
    keyboardType: any = 'default',
    isPassword = false,
    showPassState = false,
    setShowPassState: any = null
  ) => (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{placeholder}</Text>
      <View
        style={[
          styles.inputContainer,
          errors[name] && styles.inputErrorBorder,
        ]}>
        <Icon
          name={icon}
          size={20}
          color={errors[name] ? THEME.error : THEME.textPlaceholder}
          style={styles.inputIcon}
        />
        <Controller
          control={control}
          name={name}
          rules={rules}
          render={({ field }) => (
            <TextInput
              placeholder={placeholder}
              placeholderTextColor={THEME.textPlaceholder}
              value={field.value as string}
              onChangeText={field.onChange}
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType={keyboardType}
              secureTextEntry={isPassword && !showPassState}
            />
          )}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassState(!showPassState)}
            style={styles.eyeIcon}>
            <Icon
              name={showPassState ? 'eye' : 'eye-off'}
              size={20}
              color={THEME.textPlaceholder}
            />
          </TouchableOpacity>
        )}
      </View>
      {errors[name] && (
        <Text style={styles.errorText}>{errors[name]?.message}</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.background} />

      {/* Decorative Glow */}
      <View style={styles.topGlow} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={24} color={THEME.textWhite} />
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
                <Text style={styles.appName}>CREATE ACCOUNT</Text>
                <Text style={styles.subtitle}>
                  Start your movie journey today
                </Text>
            </View>
          </View>

          {/* FORM */}
          <View style={styles.formSection}>
            
            {/* Name */}
            {renderInput('name', 'Full Name', 'person', { ...required('Name is required') })}

            {/* Phone */}
            {renderInput('phoneNumber', 'Phone Number', 'call', { ...isPhoneNumber, ...required('Phone is required') }, 'phone-pad')}

            {/* Email */}
            {renderInput('email', 'Email Address', 'mail', { ...required('Email is required'), ...isEmail }, 'email-address')}

            {/* Date of Birth */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Date of Birth</Text>
              <Controller
                control={control}
                name="dob"
                rules={{ ...required('Date of birth is required') }}
                render={({ field }) => (
                  <>
                    <TouchableOpacity
                      style={[styles.inputContainer, errors.dob && styles.inputErrorBorder]}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <Icon
                        name="calendar"
                        size={20}
                        color={THEME.textPlaceholder}
                        style={styles.inputIcon}
                      />
                      <Text style={[styles.dateText, !field.value && { color: THEME.textPlaceholder }]}>
                        {field.value
                          ? formatDateOfBirth(field.value)
                          : 'Select Date'}
                      </Text>
                      <Icon name="chevron-down" size={16} color={THEME.textPlaceholder} />
                    </TouchableOpacity>
                    <DatePicker
                      modal
                      open={showDatePicker}
                      date={field.value || new Date()}
                      mode="date"
                      maximumDate={new Date()}
                      onConfirm={date => {
                        setShowDatePicker(false);
                        field.onChange(date);
                      }}
                      onCancel={() => setShowDatePicker(false)}
                    />
                  </>
                )}
              />
              {errors.dob && <Text style={styles.errorText}>{errors.dob.message}</Text>}
            </View>

            {/* City Dropdown */}
            <View style={styles.inputWrapper}>
               <Text style={styles.label}>City</Text>
               <Controller
                control={control}
                name="city"
                rules={{ required: 'City is required' }}
                render={({ field }) => (
                    <View style={[styles.inputContainer, errors.city && styles.inputErrorBorder]}>
                         <Icon name="location" size={20} color={THEME.textPlaceholder} style={styles.inputIcon} />
                          <Dropdown
                            style={styles.dropdown}
                            containerStyle={styles.dropdownContainer}
                            itemTextStyle={styles.dropdownItemText}
                            placeholderStyle={styles.dropdownPlaceholder}
                            selectedTextStyle={styles.dropdownText}
                            itemContainerStyle={styles.dropdownItem}
                            activeColor={THEME.background}
                            iconColor={THEME.textPlaceholder}
                            search
                            searchPlaceholder="Search..."
                            inputSearchStyle={styles.dropdownSearchInput}
                            data={cities}
                            labelField="label"
                            valueField="value"
                            placeholder="Select city"
                            value={field.value}
                            onChange={item => field.onChange(item.value)}
                          />
                    </View>
                )}
              />
              {errors.city && <Text style={styles.errorText}>{errors.city.message}</Text>}
            </View>

            {/* Address */}
            {renderInput('address', 'Address', 'home', { ...required('Address is required') })}

            {/* Gender */}
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.genderContainer}>
                <Controller
                  control={control}
                  name="genre"
                  defaultValue={true}
                  render={({ field }) => (
                    <>
                      <TouchableOpacity
                        style={[
                          styles.genderButton,
                          field.value === true && styles.genderButtonActive,
                        ]}
                        onPress={() => field.onChange(true)}
                      >
                        <Icon
                          name="male"
                          size={18}
                          color={field.value === true ? THEME.textWhite : THEME.textGray}
                        />
                        <Text
                          style={[
                            styles.genderButtonText,
                            field.value === true && styles.genderButtonTextActive,
                          ]}
                        >
                          Male
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.genderButton,
                          field.value === false && styles.genderButtonActive,
                        ]}
                        onPress={() => field.onChange(false)}
                      >
                        <Icon
                          name="female"
                          size={18}
                          color={field.value === false ? THEME.textWhite : THEME.textGray}
                        />
                        <Text
                          style={[
                            styles.genderButtonText,
                            field.value === false && styles.genderButtonTextActive,
                          ]}
                        >
                          Female
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                />
              </View>
            </View>

            {/* Password */}
            {renderInput('password', 'Password', 'lock-closed', { ...required('Password is required'), ...strongPassword }, 'default', true, showPassword, setShowPassword)}

            {/* Confirm Password */}
            {renderInput('confirmPassword', 'Confirm Password', 'lock-closed', { ...required('Confirm Password is required'), ...strongPassword, ...matchPassword(getValues, 'password') }, 'default', true, showConfirmPassword, setShowConfirmPassword)}

            {/* Register Button */}
            <TouchableOpacity
              style={[
                styles.registerButton,
                isSubmitting && styles.registerButtonDisabled,
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
               {isSubmitting ? (
                  <Text style={styles.registerButtonText}>Creating Account...</Text>
               ) : (
                 <>
                    <Text style={styles.registerButtonText}>Create Account</Text>
                    <Icon name="arrow-forward" size={20} color="#FFF" style={{marginLeft: 8}} />
                 </>
               )}
            </TouchableOpacity>

          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
              <Text style={styles.signInText}>Sign in</Text>
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
    paddingVertical: 20,
    paddingBottom: 40,
  },

  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  appName: {
    fontSize: 20,
    fontWeight: '800',
    color: THEME.textWhite,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 14,
    color: THEME.textGray,
    marginTop: 2,
  },

  // FORM
  formSection: {
    marginBottom: 20,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
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
  inputErrorBorder: {
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
  errorText: {
    color: THEME.error,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  dateText: {
    flex: 1,
    fontSize: 15,
    color: THEME.textWhite,
  },

  // DROPDOWN
  dropdown: {
    flex: 1,
  },
  dropdownText: {
    fontSize: 15,
    color: THEME.textWhite,
  },
  dropdownPlaceholder: {
    fontSize: 15,
    color: THEME.textPlaceholder,
  },
  dropdownContainer: {
    backgroundColor: '#2A2C3A', // Slightly lighter than cardBg for popup
    borderRadius: 12,
    borderWidth: 0,
    marginTop: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#2A2C3A',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  dropdownItemText: {
    fontSize: 15,
    color: THEME.textWhite,
  },
  dropdownSearchInput: {
    borderRadius: 8,
    color: THEME.textWhite,
    backgroundColor: '#1F2130',
    fontSize: 14,
    borderWidth: 0,
    margin: 8,
  },

  // GENDER
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.cardBg,
    borderRadius: 16,
    height: 50,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  genderButtonActive: {
    backgroundColor: 'rgba(255, 59, 48, 0.15)', // Light Red Tint
    borderColor: THEME.accent,
  },
  genderButtonText: {
    fontSize: 14,
    color: THEME.textGray,
    marginLeft: 8,
    fontWeight: '600',
  },
  genderButtonTextActive: {
    color: THEME.accent,
  },

  // REGISTER BUTTON
  registerButton: {
    height: 58,
    borderRadius: 29,
    backgroundColor: THEME.accent,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: THEME.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
    marginTop: 12,
  },
  registerButtonDisabled: {
    opacity: 0.7,
    backgroundColor: '#3A3A3A',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // FOOTER
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
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

export default RegisterScreen;