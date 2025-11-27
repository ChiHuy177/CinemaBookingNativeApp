/* eslint-disable react-hooks/exhaustive-deps */
import {Controller, SubmitHandler, useForm} from 'react-hook-form';
import {ForgotPasswordScreenProps} from '../types/screentypes';
import {useCallback} from 'react';
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
import {isEmail, required} from '../utils/validators';
import {useSpinner} from '../context/SpinnerContext';
import {SafeAreaView} from 'react-native-safe-area-context';
import {sendResetPasswordCode} from '../services/AuthService';
import {showToast, checkErrorFetchingData} from '../utils/function';

interface FormData {
  email: string;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  navigation,
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<FormData>();

  const {showSpinner, hideSpinner} = useSpinner();

  const onSubmit: SubmitHandler<FormData> = useCallback(
    async data => {
      try {
        showSpinner();
        const responseData = await sendResetPasswordCode(data.email);
        if (responseData.code === 1000) {
          showToast({
            type: 'success',
            text1: 'Verification code sent successfully!',
          });
          setTimeout(() => {
            navigation.navigate('ResetPasswordScreen', {
              email: data.email,
            });
          }, 2000);
        }
      } catch (error) {
        checkErrorFetchingData({
          error: error,
          title: 'Error sending verification code',
        });
      } finally {
        hideSpinner();
      }
    },
    [navigation, showSpinner, hideSpinner],
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
          <View style={styles.header}>
            <Text style={styles.title}>Quên Mật Khẩu?</Text>
            <Text style={styles.subtitle}>
              Nhập địa chỉ email của bạn và chúng tôi sẽ gửi một mã xác thực để
              bạn đặt lại mật khẩu.
            </Text>
          </View>

          {/* Input field and error display */}
          <View style={styles.form}>
            <View
              style={[
                styles.inputContainer,
                errors.email && styles.inputError,
              ]}>
              <Icon
                name="mail-outline"
                size={20}
                color={errors.email ? '#FF4444' : '#C5C5C5'}
                style={styles.inputIcon}
              />
              <Controller
                control={control}
                name="email"
                rules={{
                  ...required('Email là bắt buộc'),
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
            {errors.email && (
              <Text style={styles.error}>{errors.email.message}</Text>
            )}

            <TouchableOpacity
              style={[styles.sendButton, isSubmitting && styles.disabledButton]}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}>
              <Text style={styles.sendButtonText}>Gửi Mã Xác Thực</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Bạn nhớ mật khẩu rồi? </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.signInText}>Đăng Nhập</Text>
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
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 24,
    zIndex: 1,
    padding: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 40,
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
    textAlign: 'center',
    lineHeight: 24,
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
  inputError: {
    borderWidth: 1,
    borderColor: '#FF4444',
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
    // Shadow for better depth
    shadowColor: '#FF8133',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  disabledButton: {
    backgroundColor: '#A0A0A0', // Gray out when disabled/submitting
    shadowColor: 'transparent',
    elevation: 0,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700', // Changed to 700 for better visibility
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
    fontWeight: '700', // Changed to 700 for better contrast
  },
  error: {
    color: '#FF4444',
    marginBottom: 16, // Increased spacing for better readability
    fontSize: 14,
    textAlign: 'left', // Ensure error message aligns
    paddingLeft: 4,
    marginTop: -10, // Adjust to position it right after the input container
  },
});