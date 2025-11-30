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
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {CameraOptions} from 'react-native-image-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {EditProfileScreenProps} from '../types/screentypes';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Dropdown } from 'react-native-element-dropdown';
import { Icon } from 'react-native-paper';
import { colors } from '../constant/color';
import { requestCameraPermission } from '../constant/function';
import { useSpinner } from '../context/SpinnerContext';
import { updateClient } from '../services/ClientService';
import { EditClientProfileProps } from '../types/client';
import { getCitiesAPI, checkErrorFetchingData, showToast, formatDateOfBirth } from '../utils/function';
import { required, isPhoneNumber } from '../utils/validators';

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
            text1: 'Update Successfully!!',
          });
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
        text: 'Libraries',
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
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.dark}]}>
      <StatusBar
        backgroundColor={colors.dark}
        barStyle="light-content"
      />

      <View
        style={[
          styles.header,
          {backgroundColor: colors.mediumGray},
        ]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon
            source="chevron-left"
            size={30}
            color={colors.white}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: colors.white}]}>
          Edit Profile
        </Text>
        <TouchableOpacity
          disabled={isSubmitting}
          onPress={handleSubmit(onSubmit)}
          style={styles.saveButton}>
          <Text
            style={[
              styles.saveButtonText,
              {color: colors.primary},
            ]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Controller
                control={control}
                name="avatarObject"
                render={({field}) => (
                  <Image
                    source={{uri: field.value?.uri}}
                    style={[
                      styles.avatar,
                      {borderColor: colors.primary},
                    ]}
                  />
                )}
              />
              <TouchableOpacity
                style={[
                  styles.editAvatarButton,
                  {backgroundColor: colors.primary},
                ]}
                onPress={showModalConfirmImage}>
                <Icon
                  source="camera"
                  size={16}
                  color={colors.white}
                />
              </TouchableOpacity>
            </View>
            <Text
              style={[
                styles.avatarText,
                {color: colors.lightGray},
              ]}>
              Press to change avatar
            </Text>
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, {color: colors.white}]}>
              Họ và tên *
            </Text>
            {errors.name && (
              <Text style={styles.error}>{errors.name.message}</Text>
            )}
            <View
              style={[
                styles.inputContainer,
                {backgroundColor: colors.mediumGray},
              ]}>
              <Icon
                source="account"
                size={20}
                color={colors.lightGray}
              />
              <Controller
                control={control}
                name="name"
                rules={{
                  ...required('Name is required'),
                }}
                render={({field}) => (
                  <TextInput
                    placeholder="Name"
                    placeholderTextColor="#C5C5C5"
                    value={field.value}
                    onChangeText={field.onChange}
                    style={[
                      styles.textInput,
                      {color: colors.white},
                    ]}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                )}
              />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, {color: colors.white}]}>
              Email
            </Text>
            <View
              style={[
                styles.inputContainer,
                styles.disabledInput,
                {backgroundColor: colors.mediumGray},
              ]}>
              <Icon
                source="email"
                size={20}
                color={colors.lightGray}
              />
              <Controller
                control={control}
                name="email"
                render={({field}) => (
                  <TextInput
                    value={field.value}
                    editable={false}
                    style={[
                      styles.textInput,
                      styles.disabledText,
                      {color: colors.lightGray},
                    ]}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                )}
              />
              <Icon
                source="lock"
                size={16}
                color={colors.lightGray}
              />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, {color: colors.white}]}>
              City *
            </Text>

            {errors.city && (
              <Text style={styles.error}>{errors.city.message}</Text>
            )}
            <View
              style={[
                styles.inputContainer,
                {backgroundColor: colors.mediumGray},
              ]}>
              <Icon
                source="map-marker"
                size={20}
                color={colors.lightGray}
              />
              <Controller
                control={control}
                name="city"
                rules={{required: 'City is required'}}
                render={({field}) => (
                  <Dropdown
                    style={styles.textInput}
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
                    value={{label: field.value, value: field.value}}
                    onChange={item => field.onChange(item.value)}
                  />
                )}
              />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, {color: colors.white}]}>
              PhoneNumber *
            </Text>
            {errors.phoneNumber && (
              <Text style={styles.error}>{errors.phoneNumber.message}</Text>
            )}
            <View
              style={[
                styles.inputContainer,
                {backgroundColor: colors.mediumGray},
              ]}>
              <Icon
                source="phone"
                size={20}
                color={colors.lightGray}
              />
              <Controller
                control={control}
                name="phoneNumber"
                rules={{
                  ...isPhoneNumber,
                  ...required('Phone is required'),
                }}
                render={({field}) => (
                  <TextInput
                    placeholder="PhoneNumber"
                    placeholderTextColor="#C5C5C5"
                    value={field.value}
                    onChangeText={field.onChange}
                    style={[
                      styles.textInput,
                      {color: colors.white},
                    ]}
                    autoCapitalize="words"
                    autoCorrect={false}
                    keyboardType="phone-pad"
                  />
                )}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, {color: colors.white}]}>
              Date of Birth *
            </Text>
            {errors.doB && (
              <Text style={styles.error}>{errors.doB.message}</Text>
            )}
            <View
              style={[
                styles.inputContainer,
                {backgroundColor: colors.mediumGray},
              ]}>
              <Icon
                source="calendar-outline"
                size={20}
                color={colors.lightGray}
              />
              <Controller
                control={control}
                name="doB"
                rules={{
                  ...required('Date of birth is required'),
                }}
                render={({field}) => (
                  <>
                    <TouchableOpacity
                      style={styles.inputContainer}
                      onPress={() => setShowDatePicker(true)}>
                      <Text style={styles.dateText}>
                        {field.value
                          ? formatDateOfBirth(field.value)
                          : 'Select date of birth'}
                      </Text>
                      <Icon source="chevron-down" size={20} color="#C5C5C5" />
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
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, {color: colors.white}]}>
              Address
            </Text>
            <View
              style={[
                styles.inputContainer,
                {backgroundColor: colors.mediumGray},
              ]}>
              <Icon
                source="road-variant"
                size={20}
                color={colors.lightGray}
              />
              <Controller
                control={control}
                name="address"
                render={({field}) => (
                  <TextInput
                    placeholder="Address"
                    placeholderTextColor="#C5C5C5"
                    value={field.value}
                    onChangeText={field.onChange}
                    style={[
                      styles.textInput,
                      {color: colors.white},
                    ]}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                )}
              />
            </View>
          </View>

          <View style={[styles.genderContainer]}>
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
                      source="gender-male"
                      size={20}
                      color={field.value ? '#FFFFFF' : '#C5C5C5'}
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
                      source="gender-female"
                      size={20}
                      color={!field.value ? '#FFFFFF' : '#C5C5C5'}
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  saveButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  avatarText: {
    fontSize: 14,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    minHeight: 50,
  },
  disabledInput: {
    opacity: 0.7,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
    paddingVertical: 0,
  },
  selectText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  disabledText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionsList: {
    maxHeight: 400,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  bottomSpacing: {
    height: 30,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  chevronIcon: {
    marginLeft: 8,
  },
  dropdownText: {
    fontSize: 16,
    color: '#FFFFFF',
  },

  dropdownPlaceholder: {
    fontSize: 16,
    color: '#fff',
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
  genderContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
  error: {color: 'red', marginBottom: 10},
});

export default EditProfileScreen;
