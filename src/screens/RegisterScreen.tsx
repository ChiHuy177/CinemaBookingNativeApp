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

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    getValues,
    setValue,
  } = useForm<RegisterRequest>();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
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
          text1: 'register successfully!',
          text2: `${responseData.result}`,
        });
      }
    } catch (error: any) {
      console.error(error.response)
      checkErrorFetchingData({
        error,
        title: 'Register Failed',
      });
    } finally {
      hideSpinner();
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#070816" />

      {/* fake gradient blobs giống login */}
      <View style={styles.bgCircleTop} />
      <View style={styles.bgCircleBottom} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="chevron-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.badge}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>Cinema App</Text>
            </View>

            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>
              Start your
              <Text style={styles.subtitleBold}> movie journey</Text>
            </Text>
          </View>

          {/* FORM CARD */}
          <View style={styles.formCard}>
            {errors.name && (
              <Text style={styles.error}>{errors.name.message}</Text>
            )}

            <View style={styles.inputContainer}>
              <Icon
                name="person-outline"
                size={20}
                color="#C5C5C5"
                style={styles.inputIcon}
              />
              <Controller
                control={control}
                name="name"
                rules={{
                  ...required('Name is required'),
                }}
                render={({ field }) => (
                  <TextInput
                    placeholder="Name"
                    placeholderTextColor="#8E8E93"
                    value={field.value}
                    onChangeText={field.onChange}
                    style={styles.input}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                )}
              />
            </View>

            {errors.phoneNumber && (
              <Text style={styles.error}>{errors.phoneNumber.message}</Text>
            )}
            <View style={styles.inputContainer}>
              <Icon
                name="call-outline"
                size={20}
                color="#C5C5C5"
                style={styles.inputIcon}
              />
              <Controller
                control={control}
                name="phoneNumber"
                rules={{
                  ...isPhoneNumber,
                  ...required('Phone is required'),
                }}
                render={({ field }) => (
                  <TextInput
                    placeholder="Phone number"
                    placeholderTextColor="#8E8E93"
                    value={field.value}
                    onChangeText={field.onChange}
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="phone-pad"
                  />
                )}
              />
            </View>

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
                render={({ field }) => (
                  <TextInput
                    placeholder="Email"
                    placeholderTextColor="#8E8E93"
                    value={field.value}
                    onChangeText={field.onChange}
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                  />
                )}
              />
            </View>

            {errors.dob && (
              <Text style={styles.error}>{errors.dob.message}</Text>
            )}
            <Controller
              control={control}
              name="dob"
              rules={{
                ...required('Date of birth is required'),
              }}
              render={({ field }) => (
                <>
                  <TouchableOpacity
                    style={styles.inputContainer}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Icon
                      name="calendar-outline"
                      size={20}
                      color="#C5C5C5"
                      style={styles.inputIcon}
                    />
                    <Text style={styles.dateText}>
                      {field.value
                        ? formatDateOfBirth(field.value)
                        : 'Select date of birth'}
                    </Text>
                    <Icon
                      name="chevron-down-outline"
                      size={20}
                      color="#C5C5C5"
                      style={styles.chevronIcon}
                    />
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

            {errors.city && (
              <Text style={styles.error}>{errors.city.message}</Text>
            )}
            <View style={styles.inputContainer}>
              <Icon
                name="location-outline"
                size={20}
                color="#C5C5C5"
                style={styles.inputIcon}
              />
              <Controller
                control={control}
                name="city"
                rules={{ required: 'City is required' }}
                render={({ field }) => (
                  <Dropdown
                    style={styles.dropdown}
                    containerStyle={styles.dropdownContainer}
                    itemTextStyle={styles.dropdownItemText}
                    placeholderStyle={styles.dropdownPlaceholder}
                    selectedTextStyle={styles.dropdownText}
                    itemContainerStyle={styles.dropdownItem}
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
                )}
              />
            </View>

            {errors.address && (
              <Text style={styles.error}>{errors.address.message}</Text>
            )}
            <View style={styles.inputContainer}>
              <Icon
                name="home-outline"
                size={20}
                color="#C5C5C5"
                style={styles.inputIcon}
              />
              <Controller
                control={control}
                name="address"
                rules={{
                  ...required('Address is required'),
                }}
                render={({ field }) => (
                  <TextInput
                    placeholder="Address"
                    placeholderTextColor="#8E8E93"
                    value={field.value}
                    onChangeText={field.onChange}
                    style={styles.input}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                )}
              />
            </View>

            <View style={styles.genderContainer}>
              <View style={styles.genderButtons}>
                <Controller
                  control={control}
                  name="genre"
                  defaultValue={false}
                  render={({ field }) => (
                    <>
                      <TouchableOpacity
                        style={[
                          styles.genderButton,
                          field.value && styles.genderButtonActive,
                        ]}
                        onPress={() => field.onChange(true)}
                      >
                        <Icon
                          name="man-outline"
                          size={20}
                          color={field.value ? '#FFFFFF' : '#C5C5C5'}
                        />
                        <Text
                          style={[
                            styles.genderButtonText,
                            field.value && styles.genderButtonTextActive,
                          ]}
                        >
                          Male
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.genderButton,
                          !field.value && styles.genderButtonActive,
                        ]}
                        onPress={() => field.onChange(false)}
                      >
                        <Icon
                          name="woman-outline"
                          size={20}
                          color={!field.value ? '#FFFFFF' : '#C5C5C5'}
                        />
                        <Text
                          style={[
                            styles.genderButtonText,
                            !field.value && styles.genderButtonTextActive,
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
                render={({ field }) => (
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor="#8E8E93"
                    value={field.value}
                    onChangeText={field.onChange}
                    style={styles.input}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
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
                  ...required('ConfirmPassword is required'),
                  ...strongPassword,
                  ...matchPassword(getValues, 'password'),
                }}
                render={({ field }) => (
                  <TextInput
                    placeholder="Confirm password"
                    placeholderTextColor="#8E8E93"
                    value={field.value}
                    onChangeText={field.onChange}
                    style={styles.input}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Icon
                  name={
                    showConfirmPassword ? 'eye-outline' : 'eye-off-outline'
                  }
                  size={20}
                  color="#C5C5C5"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.registerButton}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              <Text style={styles.registerButtonText}>Create account</Text>
            </TouchableOpacity>
          </View>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('LoginScreen')}
            >
              <Text style={styles.signInText}> Sign in</Text>
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
    backgroundColor: '#070816',
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
    marginBottom: 24,
  },
  backButton: {
    padding: 4,
    marginBottom: 12,
    alignSelf: 'flex-start',
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
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#B0B0B5',
  },
  subtitleBold: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  formCard: {
    backgroundColor: 'rgba(12, 11, 23, 0.96)',
    borderRadius: 24,
    padding: 22,
    marginBottom: 28,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.45,
    shadowRadius: 30,
    elevation: 16,
  },

  form: {
    marginBottom: 32,
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
  dateText: {
    flex: 1,
    fontSize: 15,
    color: '#FFFFFF',
  },
  chevronIcon: {
    marginLeft: 8,
  },

  genderContainer: {
    marginBottom: 16,
  },
  genderButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  genderButtonActive: {
    backgroundColor: '#FF4B3A',
    borderColor: '#FF4B3A',
  },
  genderButtonText: {
    fontSize: 15,
    color: '#C5C5C5',
    marginLeft: 8,
    fontWeight: '500',
  },
  genderButtonTextActive: {
    color: '#FFFFFF',
  },

  registerButton: {
    backgroundColor: '#FF4B3A',
    borderRadius: 18,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#FF4B3A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 24,
    elevation: 10,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 24,
  },
  footerText: {
    color: '#8E8E93',
    fontSize: 14,
  },
  signInText: {
    color: '#FF4B3A',
    fontSize: 14,
    fontWeight: '700',
  },

  error: {
    color: '#FF6B6B',
    marginBottom: 6,
    fontSize: 12,
  },

  dropdown: {
    flex: 1,
  },
  dropdownText: {
    fontSize: 15,
    color: '#FFFFFF',
  },
  dropdownPlaceholder: {
    fontSize: 15,
    color: '#8E8E93',
  },
  dropdownContainer: {
    backgroundColor: '#141525',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3D3D4F',
  },
  dropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#555',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#FFFFFF',
  },
  dropdownSearchInput: {
    borderRadius: 8,
    color: '#FFFFFF',
    backgroundColor: '#2F2F3C',
    fontSize: 15,
  },
});

export default RegisterScreen;
