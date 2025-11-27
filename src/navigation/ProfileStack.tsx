import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ProfileStackParamList} from './StackParamList';
import {ProfileStackProps} from '../types/screentypes';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import { ChangePasswordScreen } from '../screens/ChangePasswordScreen';
import CouponListScreen from '../screens/CouponListScreen';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileStack: React.FC<ProfileStackProps> = () => {
  return (
    <Stack.Navigator initialRouteName="ProfileScreen">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="ProfileScreen"
        component={ProfileScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="EditProfileScreen"
        component={EditProfileScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="CouponListScreen"
        component={CouponListScreen}
      />
    </Stack.Navigator>
  );
};
