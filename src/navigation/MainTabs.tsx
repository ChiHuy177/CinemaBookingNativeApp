/* eslint-disable react/no-unstable-nested-components */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomTabParamList} from './BottomTabParamList';
import {MainTabsProps} from '../types/screentypes';
import {Icon} from 'react-native-paper';

import { ProfileStack } from './ProfileStack';
import { FavoriteMovieScreen } from '../screens/FavoriteMovieScreen';
import { HomeStack } from './HomeStack';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const MainTabs: React.FC<MainTabsProps> = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={{
        tabBarActiveTintColor: '#FF3B30', // Accent color matching HomeScreen
        tabBarInactiveTintColor: '#8F90A6', // Text gray matching HomeScreen
        tabBarStyle: {
          backgroundColor: '#1F2130', // Card background matching HomeScreen
          borderTopWidth: 0, // Remove default border
          elevation: 0, // Remove shadow on Android
          shadowOpacity: 0, // Remove shadow on iOS
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Icon source="home" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="FavoriteTab"
        component={FavoriteMovieScreen}
        options={{
          tabBarLabel: 'Favorite',
          tabBarIcon: ({color, size}) => (
            <Icon source="heart-circle" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Customer',
          tabBarIcon: ({color, size}) => (
            <Icon source="account" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      {/* <Tab.Screen
        name="Setting"
        component={Home}
        options={{
          tabBarLabel: 'Setting',
          tabBarIcon: ({color, size}) => (
            <Icon name="gear" size={size} color={color} />
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
};
