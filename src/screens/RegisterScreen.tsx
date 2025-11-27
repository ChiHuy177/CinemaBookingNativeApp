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
      <StatusBar barStyle="light-content" backgroundColor="#2F2F2F" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
          </View>
          {errors.name && (
            <Text style={styles.error}>{errors.name.message}</Text>
          )}
          <View style={styles.form}>
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
                    placeholderTextColor="#C5C5C5"
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
                    placeholder="PhoneNumber"
                    placeholderTextColor="#C5C5C5"
                    value={field.value}
                    onChangeText={field.onChange}
                    style={styles.input}
                    autoCapitalize="words"
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
                    placeholderTextColor="#C5C5C5"
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
                    style={styles.input}
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
                    placeholder="Chọn thành phố"
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
                    placeholderTextColor="#C5C5C5"
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
                    placeholderTextColor="#C5C5C5"
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
                    placeholder="ConfirmPassword"
                    placeholderTextColor="#C5C5C5"
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
                  name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
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
              <Text style={styles.registerButtonText}>Create Account</Text>
            </TouchableOpacity>

            {/* <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View> */}

            {/* <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialRegister('google')}>
              <Icon name="logo-google" size={20} color="#FFFFFF" />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialRegister('facebook')}>
              <Icon name="logo-facebook" size={20} color="#FFFFFF" />
              <Text style={styles.socialButtonText}>
                Continue with Facebook
              </Text>
            </TouchableOpacity> */}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('LoginScreen')}
            >
              <Text style={styles.signInText}>Sign In</Text>
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
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#C5C5C5',
  },
  form: {
    marginBottom: 32,
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
    fontSize: 16,
    color: '#FFFFFF',
  },
  chevronIcon: {
    marginLeft: 8,
  },
  genderContainer: {
    marginBottom: 16,
  },
  genderLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 12,
    fontWeight: '500',
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
    backgroundColor: '#3D3D3D',
    borderRadius: 12,
    height: 56,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  genderButtonActive: {
    backgroundColor: '#FF8133',
    borderColor: '#FF8133',
  },
  genderButtonText: {
    fontSize: 16,
    color: '#C5C5C5',
    marginLeft: 8,
    fontWeight: '500',
  },
  genderButtonTextActive: {
    color: '#FFFFFF',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#C5C5C5',
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#FF8133',
    borderColor: '#FF8133',
  },
  termsTextContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  termsText: {
    color: '#C5C5C5',
    fontSize: 14,
    lineHeight: 20,
  },
  termsLink: {
    color: '#FF8133',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  registerButton: {
    backgroundColor: '#FF8133',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  registerButtonText: {
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
    paddingBottom: 20,
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
  buttonDatePicker: {
    color: '#FF8133',
  },
  error: { color: 'red', marginBottom: 10 },

  dropdownText: {
    fontSize: 16,
    color: '#FFFFFF',
  },

  dropdownPlaceholder: {
    fontSize: 16,
    color: '#C5C5C5',
  },

  dropdownContainer: {
    backgroundColor: '#3D3D3D',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3D3D3D',
  },

  dropdownItem: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#555',
  },

  dropdownItemText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  dropdownSearchInput: {
    borderRadius: 8,
    color: '#FFFFFF',
    backgroundColor: '#2F2F2F',
    fontSize: 16,
  },
});

export default RegisterScreen;
