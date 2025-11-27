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
import {changePasswordClient} from '../services/ClientService';
import {ChangePasswordProfileProps} from '../types/client';
import {showToast, checkErrorFetchingData} from '../utils/function';

// THEME COLORS EXTRACTED FROM IMAGE
const COLORS = {
  background: '#0B0F19', // Deep dark blue/black background
  card: '#1D212E', // Slightly lighter for inputs/cards
  primary: '#F54B46', // The coral/red color from the buttons
  text: '#FFFFFF',
  textSecondary: '#7B8299', // Muted text color
  inputIcon: '#A0A5BD',
};

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
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          
          {/* Header Area styled like the top bar in the image */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <Icon name="chevron-back" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Change Password</Text>
            <View style={{width: 40}} /> {/* Spacer for centering */}
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.header}>
              <Text style={styles.subTitle}>
                Create a new password to secure your account.
              </Text>
            </View>

            {errors.currentPassword && (
              <Text style={styles.error}>{errors.currentPassword.message}</Text>
            )}
            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <Icon
                  name="lock-closed-outline"
                  size={20}
                  color={COLORS.inputIcon}
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
                      placeholder="Current password"
                      placeholderTextColor={COLORS.textSecondary}
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
                    color={COLORS.inputIcon}
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
                  color={COLORS.inputIcon}
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
                      placeholderTextColor={COLORS.textSecondary}
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
                    color={COLORS.inputIcon}
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
                  color={COLORS.inputIcon}
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
                      placeholderTextColor={COLORS.textSecondary}
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
                    color={COLORS.inputIcon}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}>
                <Text style={styles.resetButtonText}>Confirm Change</Text>
                <View style={styles.buttonIconContainer}>
                    <Icon name="arrow-forward" size={20} color="#FFF" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.card, // Square button style like in image
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    marginBottom: 25,
  },
  subTitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  form: {
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card, // Card background from image
    borderRadius: 16, // More rounded corners like image
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 60, // Slightly taller for modern look
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: 'transparent',
  },
  passwordInput: {
    paddingRight: 40,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  resetButton: {
    backgroundColor: COLORS.primary, // The red color from image
    borderRadius: 16,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: COLORS.primary,
    shadowOffset: {
        width: 0,
        height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  buttonIconContainer: {
      // Optional: if you want an icon next to text inside button
  },
  error: {
    color: '#FF4444',
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 12,
  },
});