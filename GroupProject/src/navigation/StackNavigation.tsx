import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../utils/toastconfig';
import { RootStackParamList } from './StackParamList';
// import { MainTabs } from './MainTabs';
import { navigationRef } from '../utils/navigation';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { ResetPasswordScreen } from '../screens/ResetPasswordScreen';
import { ForgotPasswordScreen } from '../screens/ForgotPasswordScreen';
import { MainTabs } from './MainTabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="LoginScreen"
          component={LoginScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false,
            headerBackVisible: false,
          }}
          name="RegisterScreen"
          component={RegisterScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="ForgotPasswordScreen"
          component={ForgotPasswordScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="ResetPasswordScreen"
          component={ResetPasswordScreen}
        />
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="MainTabs"
          component={MainTabs}
        />
      </Stack.Navigator>
      <Toast
        position="top"
        autoHide
        visibilityTime={2000}
        config={toastConfig}
      />
    </NavigationContainer>
  );
}
