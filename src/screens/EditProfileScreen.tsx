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
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {CameraOptions} from 'react-native-image-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {EditProfileScreenProps} from '../types/screentypes';
import {useForm, SubmitHandler, Controller} from 'react-hook-form';
import {Dropdown} from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';
import {requestCameraPermission} from '../constant/function';
import {useSpinner} from '../context/SpinnerContext';
import {updateClient} from '../services/ClientService';
import {EditClientProfileProps} from '../types/client';
import {getCitiesAPI, checkErrorFetchingData, showToast, formatDateOfBirth} from '../utils/function';
import {required, isPhoneNumber} from '../utils/validators';
import {SafeAreaView} from 'react-native-safe-area-context';


// THEME CONSTANTS
const THEME = {
  background: '#10111D',
  cardBg: '#1F2130',
  accent: '#F74346',
  textWhite: '#FFFFFF',
  textGray: '#8F90A6',
  textPlaceholder: '#5C5E6F',
  error: '#F74346',
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
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.background} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="chevron-back" size={24} color={THEME.textWhite} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity
            disabled={isSubmitting}
            onPress={handleSubmit(onSubmit)}
            style={styles.saveButton}>
            <Icon name="checkmark" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          
          {/* Avatar Card */}
          <View style={styles.avatarCard}>
            <View style={styles.avatarGlow} />
            <View style={styles.avatarWrapper}>
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
                style={styles.cameraButton}
                onPress={showModalConfirmImage}>
                <Icon name="camera" size={20} color={THEME.textWhite} />
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarHint}>Tap camera icon to change photo</Text>
          </View>

          {/* Form Container */}
          <View style={styles.formContainer}>
            {/* Personal Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>

              {/* Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <View style={[styles.inputWrapper, errors.name && styles.inputError]}>
                  <Icon name="person-outline" size={20} color={THEME.textGray} style={styles.inputIcon} />
                  <Controller
                    control={control}
                    name="name"
                    rules={{...required('Name is required')}}
                    render={({field}) => (
                      <TextInput
                        placeholder="Enter your full name"
                        placeholderTextColor={THEME.textPlaceholder}
                        value={field.value}
                        onChangeText={field.onChange}
                        style={styles.input}
                        autoCapitalize="words"
                      />
                    )}
                  />
                </View>
                {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
              </View>

              {/* Email (Read Only) */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <View style={[styles.inputWrapper, styles.inputDisabled]}>
                  <Icon name="mail-outline" size={20} color={THEME.textGray} style={styles.inputIcon} />
                  <Controller
                    control={control}
                    name="email"
                    render={({field}) => (
                      <TextInput
                        value={field.value}
                        editable={false}
                        style={[styles.input, {color: THEME.textGray}]}
                      />
                    )}
                  />
                  <Icon name="lock-closed" size={16} color={THEME.textGray} />
                </View>
              </View>

              {/* Phone */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={[styles.inputWrapper, errors.phoneNumber && styles.inputError]}>
                  <Icon name="call-outline" size={20} color={THEME.textGray} style={styles.inputIcon} />
                  <Controller
                    control={control}
                    name="phoneNumber"
                    rules={{
                      ...isPhoneNumber,
                      ...required('Phone is required'),
                    }}
                    render={({field}) => (
                      <TextInput
                        placeholder="Enter phone number"
                        placeholderTextColor={THEME.textPlaceholder}
                        value={field.value}
                        onChangeText={field.onChange}
                        style={styles.input}
                        keyboardType="phone-pad"
                      />
                    )}
                  />
                </View>
                {errors.phoneNumber && (
                  <Text style={styles.errorText}>{errors.phoneNumber.message}</Text>
                )}
              </View>

              {/* Date of Birth */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Date of Birth</Text>
                <View style={[styles.inputWrapper, errors.doB && styles.inputError]}>
                  <Icon name="calendar-outline" size={20} color={THEME.textGray} style={styles.inputIcon} />
                  <Controller
                    control={control}
                    name="doB"
                    rules={{...required('Date of birth is required')}}
                    render={({field}) => (
                      <>
                        <TouchableOpacity
                          style={styles.dateButton}
                          onPress={() => setShowDatePicker(true)}>
                          <Text style={[styles.input, !field.value && {color: THEME.textPlaceholder}]}>
                            {field.value ? formatDateOfBirth(field.value) : 'Select date of birth'}
                          </Text>
                        </TouchableOpacity>
                        <Icon name="chevron-down" size={20} color={THEME.textGray} />
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
                {errors.doB && <Text style={styles.errorText}>{errors.doB.message}</Text>}
              </View>

              {/* Gender */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Gender</Text>
                <Controller
                  control={control}
                  name="genre"
                  render={({field}) => (
                    <View style={styles.genderContainer}>
                      <TouchableOpacity
                        style={[styles.genderButton, field.value && styles.genderButtonActive]}
                        onPress={() => field.onChange(true)}>
                        <Icon
                          name="male"
                          size={22}
                          color={field.value ? THEME.textWhite : THEME.textGray}
                        />
                        <Text style={[styles.genderText, field.value && styles.genderTextActive]}>
                          Male
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.genderButton, !field.value && styles.genderButtonActive]}
                        onPress={() => field.onChange(false)}>
                        <Icon
                          name="female"
                          size={22}
                          color={!field.value ? THEME.textWhite : THEME.textGray}
                        />
                        <Text style={[styles.genderText, !field.value && styles.genderTextActive]}>
                          Female
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>
            </View>

            {/* Location Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Location</Text>

              {/* City */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>City</Text>
                <View style={[styles.inputWrapper, errors.city && styles.inputError]}>
                  <Icon name="location-outline" size={20} color={THEME.textGray} style={styles.inputIcon} />
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
                        selectedTextStyle={styles.dropdownSelectedText}
                        itemContainerStyle={styles.dropdownItem}
                        activeColor="rgba(247, 67, 70, 0.1)"
                        iconColor={THEME.textGray}
                        search
                        searchPlaceholder="Search city..."
                        inputSearchStyle={styles.dropdownSearch}
                        data={cities}
                        labelField="label"
                        valueField="value"
                        placeholder="Select your city"
                        value={field.value}
                        onChange={item => field.onChange(item.value)}
                      />
                    )}
                  />
                </View>
                {errors.city && <Text style={styles.errorText}>{errors.city.message}</Text>}
              </View>

              {/* Address */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Address</Text>
                <View style={styles.inputWrapper}>
                  <Icon name="home-outline" size={20} color={THEME.textGray} style={styles.inputIcon} />
                  <Controller
                    control={control}
                    name="address"
                    render={({field}) => (
                      <TextInput
                        placeholder="Enter your address"
                        placeholderTextColor={THEME.textPlaceholder}
                        value={field.value}
                        onChangeText={field.onChange}
                        style={styles.input}
                        autoCapitalize="words"
                      />
                    )}
                  />
                </View>
              </View>
            </View>

            <View style={styles.bottomSpacing} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME.textWhite,
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: THEME.accent,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  // Avatar Card
  avatarCard: {
    alignItems: 'center',
    paddingVertical: 32,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 28,
    backgroundColor: THEME.cardBg,
    borderRadius: 24,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  avatarGlow: {
    position: 'absolute',
    top: -50,
    width: 200,
    height: 200,
    backgroundColor: THEME.accent,
    opacity: 0.08,
    borderRadius: 100,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(247, 67, 70, 0.2)',
    backgroundColor: '#000',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.accent,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: THEME.cardBg,
    shadowColor: THEME.accent,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarHint: {
    fontSize: 13,
    color: THEME.textGray,
    fontWeight: '500',
  },

  // Form
  formContainer: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: THEME.textWhite,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.textGray,
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.cardBg,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  inputError: {
    borderColor: THEME.error,
  },
  inputDisabled: {
    backgroundColor: 'rgba(31, 33, 48, 0.5)',
    opacity: 0.7,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: THEME.textWhite,
    fontWeight: '500',
  },
  dateButton: {
    flex: 1,
    justifyContent: 'center',
  },
  errorText: {
    color: THEME.error,
    fontSize: 12,
    marginTop: 6,
    marginLeft: 4,
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
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    gap: 10,
  },
  genderButtonActive: {
    backgroundColor: 'rgba(247, 67, 70, 0.15)',
    borderColor: THEME.accent,
  },
  genderText: {
    fontSize: 15,
    color: THEME.textGray,
    fontWeight: '600',
  },
  genderTextActive: {
    color: THEME.textWhite,
  },

  // Dropdown
  dropdown: {
    flex: 1,
  },
  dropdownSelectedText: {
    fontSize: 15,
    color: THEME.textWhite,
    fontWeight: '500',
  },
  dropdownPlaceholder: {
    fontSize: 15,
    color: THEME.textPlaceholder,
  },
  dropdownContainer: {
    backgroundColor: THEME.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  dropdownItemText: {
    fontSize: 15,
    color: THEME.textWhite,
  },
  dropdownSearch: {
    borderRadius: 12,
    color: THEME.textWhite,
    backgroundColor: THEME.background,
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    margin: 12,
    paddingHorizontal: 12,
  },

  bottomSpacing: {
    height: 20,
  },
});

export default EditProfileScreen;