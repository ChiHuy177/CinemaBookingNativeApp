/* eslint-disable react-hooks/exhaustive-deps */
import {useCallback, useState} from 'react';
import {ChangePasswordScreenProps} from '../types/screentypes';
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {matchPassword, required, strongPassword} from '../utils/validators';
import {useSpinner} from '../context/SpinnerContext';
import {SafeAreaView} from 'react-native-safe-area-context';
import { changePasswordClient } from '../services/ClientService';
import { ChangePasswordProfileProps } from '../types/client';
import { showToast, checkErrorFetchingData } from '../utils/function';


export const ChangePasswordScreen: React.FC<ChangePasswordScreenProps> = ({
  navigation,
  route,
}) => {
  const {email} = route.params;

  const [showCurrentPassword, setShowCurrentPassword] =
    useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] =
    useState<boolean>(false);

  const {
    control,
    formState: {errors, isSubmitting},
    handleSubmit,
    getValues,
  } = useForm<ChangePasswordProfileProps>({
    defaultValues: {
      email: email,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const {hideSpinner, showSpinner} = useSpinner();

  const onSubmit: SubmitHandler<ChangePasswordProfileProps> = useCallback(
    async data => {
      try {
        showSpinner();
        const responseData = await changePasswordClient(data);
        showToast({
          type: responseData.code === 1000 ? 'success' : 'error',
          text1: responseData.result,
        });
      } catch (error) {
        checkErrorFetchingData({
          error: error,
          title: 'Error resetting password',
        });
      } finally {
        hideSpinner();
      }
    },
    [],
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2F2F2F" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Change Password</Text>
          </View>

          {errors.currentPassword && (
            <Text style={styles.error}>{errors.currentPassword.message}</Text>
          )}
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Icon
                name="lock-closed-outline"
                size={20}
                color="#C5C5C5"
                style={styles.inputIcon}
              />
              <Controller
                control={control}
                name="currentPassword"
                rules={{
                  ...required('Current password is required'),
                  ...strongPassword,
                }}
                render={({field}) => (
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Enter current password"
                    placeholderTextColor="#C5C5C5"
                    secureTextEntry={!showCurrentPassword}
                    value={field.value}
                    onChangeText={field.onChange}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}
              />
              <TouchableOpacity
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                style={styles.eyeIcon}>
                <Icon
                  name={showCurrentPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#C5C5C5"
                />
              </TouchableOpacity>
            </View>

            {errors.newPassword && (
              <Text style={styles.error}>{errors.newPassword.message}</Text>
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
                name="newPassword"
                rules={{
                  ...required('New password is required'),
                  ...strongPassword,
                }}
                render={({field}) => (
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="New password"
                    placeholderTextColor="#C5C5C5"
                    secureTextEntry={!showNewPassword}
                    value={field.value}
                    onChangeText={field.onChange}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                style={styles.eyeIcon}>
                <Icon
                  name={showNewPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={20}
                  color="#C5C5C5"
                />
              </TouchableOpacity>
            </View>

            {errors.confirmNewPassword && (
              <Text style={styles.error}>
                {errors.confirmNewPassword.message}
              </Text>
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
                name="confirmNewPassword"
                rules={{
                  ...required('Please confirm your password'),
                  ...strongPassword,
                  ...matchPassword(getValues, 'newPassword'),
                }}
                render={({field}) => (
                  <TextInput
                    style={[styles.input, styles.passwordInput]}
                    placeholder="Confirm new password"
                    placeholderTextColor="#C5C5C5"
                    secureTextEntry={!showConfirmNewPassword}
                    value={field.value}
                    onChangeText={field.onChange}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}
              />
              <TouchableOpacity
                onPress={() =>
                  setShowConfirmNewPassword(!showConfirmNewPassword)
                }
                style={styles.eyeIcon}>
                <Icon
                  name={
                    showConfirmNewPassword ? 'eye-outline' : 'eye-off-outline'
                  }
                  size={20}
                  color="#C5C5C5"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}>
              <Text style={styles.resetButtonText}>Change Password</Text>
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
    paddingTop: 30,
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 24,
    zIndex: 1,
    padding: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
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
  sendButton: {
    backgroundColor: '#FF8133',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#FF8133',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  resendCode: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  resendCodeText: {
    color: '#FF8133',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: 40,
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
  error: {
    color: '#FF4444',
    marginBottom: 10,
    fontSize: 14,
  },
});
