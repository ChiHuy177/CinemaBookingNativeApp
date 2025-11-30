/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
  Image,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {CameraOptions} from 'react-native-image-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {EditProfileScreenProps} from '../types/screentypes';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Ionicons'; // Switched to Ionicons for consistency
import { requestCameraPermission } from '../constant/function';
import { useSpinner } from '../context/SpinnerContext';
import { updateClient } from '../services/ClientService';
import { EditClientProfileProps } from '../types/client';
import { getCitiesAPI, checkErrorFetchingData, showToast, formatDateOfBirth } from '../utils/function';
import { required, isPhoneNumber } from '../utils/validators';

const { width } = Dimensions.get('window');

// THEME CONSTANTS
const THEME = {
  background: '#10111D', // Dark cinematic background
  cardBg: '#1F2130',     // Input/Card background
  accent: '#FF3B30',     // Bright Red/Coral accent
  textWhite: '#FFFFFF',
  textGray: '#8F90A6',   // Muted gray
  textPlaceholder: '#5C5E6F',
  error: '#FF3B30',
  success: '#10B981',
};

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({
  navigation,
  route,
}) => {
  const {
    control,
    formState: {errors, isSubmitting},
    handleSubmit,
    setValue,
  } = useForm<EditClientProfileProps>({
    defaultValues: route.params,
  });

  const [cities, setCities] = useState([]);
  const {showSpinner, hideSpinner} = useSpinner();
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  useEffect(() => {
    async function getAllCities() {
      try {
        showSpinner();
        const cityOptions = await getCitiesAPI();
        setCities(cityOptions);
      } catch (error) {
        checkErrorFetchingData({
          error: error,
          title: 'Error fetching cities',
        });
      } finally {
        hideSpinner();
      }
    }

    getAllCities();
  }, []);

  const onSubmit: SubmitHandler<EditClientProfileProps> = useCallback(
    async data => {
      try {
        showSpinner();
        const formData = new FormData();

        formData.append('clientId', data.clientId.toString());
        formData.append('name', data.name);
        formData.append('email', data.email);
        formData.append('phoneNumber', data.phoneNumber);
        formData.append('doB', data.doB.toISOString());
        formData.append('city', data.city);
        formData.append('address', data.address);
        formData.append('genre', data.genre.toString());

        if (data.avatarObject) {
          formData.append('avatarFile', {
            uri: data.avatarObject.uri,
            name: data.avatarObject.fileName || 'avatar.jpg',
            type: data.avatarObject.type || 'image/jpeg',
          });
        }
        const responseData = await updateClient(formData);
        if (responseData.code === 1000) {
          showToast({
            type: 'success',
            text1: 'Update Successfully!',
          });
          navigation.goBack();
        } else {
          showToast({
            type: 'error',
            text1: 'Error',
            text2: responseData.result,
          });
        }
      } catch (error) {
        checkErrorFetchingData({
          error: error,
          title: 'Error updating client profile',
        });
      } finally {
        hideSpinner();
      }
    },
    [],
  );

  const handleImagePicker = useCallback(() => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 500,
      maxHeight: 500,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const asset = response.assets?.[0];
        if (asset) {
          console.log(asset);
          setValue('avatarObject', {
            uri: asset.uri!,
            fileName: asset.fileName || 'default.jpg',
            type: asset.type || 'image/jpeg',
          });
        }
      }
    });
  }, []);

  const handleCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('No Permission to use camera');
      return;
    }

    const options: CameraOptions = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 500,
      maxHeight: 500,
      saveToPhotos: true,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera Error: ', response.errorMessage);
      } else {
        const asset = response.assets?.[0];
        if (asset) {
          console.log(asset);
          setValue('avatarObject', {
            uri: asset.uri!,
            fileName: asset.fileName || 'default.jpg',
            type: asset.type || 'image/jpeg',
          });
        }
      }
    });
  };

  const showModalConfirmImage = useCallback(() => {
    Alert.alert('Pick Image', 'Where do you want to pick image?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Library',
        onPress: () => {
          handleImagePicker();
        },
      },
      {
        text: 'Camera',
        onPress: () => {
          handleCamera();
        },
      },
    ]);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.background} />

      {/* Decorative Glow */}
      <View style={styles.topGlow} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={THEME.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EDIT PROFILE</Text>
        <TouchableOpacity
          disabled={isSubmitting}
          onPress={handleSubmit(onSubmit)}
          style={styles.saveButton}>
          <Text style={styles.saveButtonText}>SAVE</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Controller
                control={control}
                name="avatarObject"
                render={({field}) => (
                  <Image
                    source={{uri: field.value?.uri}}
                    style={styles.avatar}
                  />
                )}
              />
              <TouchableOpacity
                style={styles.editAvatarButton}
                onPress={showModalConfirmImage}>
                <Icon name="camera" size={16} color={THEME.textWhite} />
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarText}>Tap to change avatar</Text>
          </View>

          {/* Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <View style={[styles.inputContainer, errors.name && styles.inputError]}>
              <Icon name="person" size={20} color={THEME.textGray} />
              <Controller
                control={control}
                name="name"
                rules={{
                  ...required('Name is required'),
                }}
                render={({field}) => (
                  <TextInput
                    placeholder="Full Name"
                    placeholderTextColor={THEME.textPlaceholder}
                    value={field.value}
                    onChangeText={field.onChange}
                    style={styles.textInput}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                )}
              />
            </View>
            {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}
          </View>

          {/* Email Input (Read Only) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email (Read-only)</Text>
            <View style={[styles.inputContainer, styles.disabledInput]}>
              <Icon name="mail" size={20} color={THEME.textGray} />
              <Controller
                control={control}
                name="email"
                render={({field}) => (
                  <TextInput
                    value={field.value}
                    editable={false}
                    style={[styles.textInput, {color: THEME.textGray}]}
                  />
                )}
              />
              <Icon name="lock-closed" size={16} color={THEME.textGray} />
            </View>
          </View>

          {/* City Dropdown */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>City *</Text>
            <View style={[styles.inputContainer, errors.city && styles.inputError]}>
              <Icon name="location" size={20} color={THEME.textGray} />
              <Controller
                control={control}
                name="city"
                rules={{required: 'City is required'}}
                render={({field}) => (
                  <Dropdown
                    style={styles.dropdown}
                    containerStyle={styles.dropdownContainer}
                    itemTextStyle={styles.dropdownItemText}
                    placeholderStyle={styles.dropdownPlaceholder}
                    selectedTextStyle={styles.dropdownText}
                    itemContainerStyle={styles.dropdownItem}
                    activeColor={THEME.background}
                    iconColor={THEME.textGray}
                    search
                    searchPlaceholder="Search..."
                    inputSearchStyle={styles.dropdownSearchInput}
                    data={cities}
                    labelField="label"
                    valueField="value"
                    placeholder="Select City"
                    value={field.value}
                    onChange={item => field.onChange(item.value)}
                  />
                )}
              />
            </View>
            {errors.city && <Text style={styles.error}>{errors.city.message}</Text>}
          </View>

          {/* Phone Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <View style={[styles.inputContainer, errors.phoneNumber && styles.inputError]}>
              <Icon name="call" size={20} color={THEME.textGray} />
              <Controller
                control={control}
                name="phoneNumber"
                rules={{
                  ...isPhoneNumber,
                  ...required('Phone is required'),
                }}
                render={({field}) => (
                  <TextInput
                    placeholder="Phone Number"
                    placeholderTextColor={THEME.textPlaceholder}
                    value={field.value}
                    onChangeText={field.onChange}
                    style={styles.textInput}
                    autoCapitalize="none"
                    keyboardType="phone-pad"
                  />
                )}
              />
            </View>
            {errors.phoneNumber && (
              <Text style={styles.error}>{errors.phoneNumber.message}</Text>
            )}
          </View>

          {/* Date of Birth */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Birth *</Text>
            <View style={[styles.inputContainer, errors.doB && styles.inputError]}>
              <Icon name="calendar" size={20} color={THEME.textGray} />
              <Controller
                control={control}
                name="doB"
                rules={{
                  ...required('Date of birth is required'),
                }}
                render={({field}) => (
                  <>
                    <TouchableOpacity
                      style={styles.dateTouchable}
                      onPress={() => setShowDatePicker(true)}>
                      <Text style={[styles.textInput, !field.value && {color: THEME.textPlaceholder}]}>
                        {field.value
                          ? formatDateOfBirth(field.value)
                          : 'Select Date'}
                      </Text>
                      <Icon name="chevron-down" size={20} color={THEME.textGray} />
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
            </View>
            {errors.doB && <Text style={styles.error}>{errors.doB.message}</Text>}
          </View>

          {/* Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <View style={styles.inputContainer}>
              <Icon name="home" size={20} color={THEME.textGray} />
              <Controller
                control={control}
                name="address"
                render={({field}) => (
                  <TextInput
                    placeholder="Address"
                    placeholderTextColor={THEME.textPlaceholder}
                    value={field.value}
                    onChangeText={field.onChange}
                    style={styles.textInput}
                    autoCapitalize="words"
                  />
                )}
              />
            </View>
          </View>

          {/* Gender */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderContainer}>
              <Controller
                control={control}
                name="genre"
                defaultValue={false}
                render={({field}) => (
                  <>
                    <TouchableOpacity
                      style={[
                        styles.genderButton,
                        field.value && styles.genderButtonActive,
                      ]}
                      onPress={() => field.onChange(true)}>
                      <Icon
                        name="male"
                        size={20}
                        color={field.value ? THEME.textWhite : THEME.textGray}
                      />
                      <Text
                        style={[
                          styles.genderButtonText,
                          field.value && styles.genderButtonTextActive,
                        ]}>
                        Male
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.genderButton,
                        !field.value && styles.genderButtonActive,
                      ]}
                      onPress={() => field.onChange(false)}>
                      <Icon
                        name="female"
                        size={20}
                        color={!field.value ? THEME.textWhite : THEME.textGray}
                      />
                      <Text
                        style={[
                          styles.genderButtonText,
                          !field.value && styles.genderButtonTextActive,
                        ]}>
                        Female
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              />
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: THEME.textWhite,
    letterSpacing: 1,
  },
  saveButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: THEME.accent,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: THEME.accent,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: THEME.background,
  },
  avatarText: {
    fontSize: 14,
    color: THEME.textGray,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.textWhite,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.cardBg,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: THEME.error,
  },
  disabledInput: {
    opacity: 0.7,
    backgroundColor: '#2A2C3A',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: THEME.textWhite,
    marginLeft: 12,
    height: '100%',
  },
  dateTouchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    marginLeft: 12,
  },
  error: {
    color: THEME.error,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
  },
  // Dropdown
  dropdown: {
    flex: 1,
    marginLeft: 12,
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
    backgroundColor: '#2A2C3A',
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
  // Gender
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
    backgroundColor: 'rgba(255, 59, 48, 0.15)',
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
  bottomSpacing: {
    height: 40,
  },
});

export default EditProfileScreen;