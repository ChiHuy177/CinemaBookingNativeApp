/* eslint-disable react/no-unstable-nested-components */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomTabParamList} from './BottomTabParamList';
import {MainTabsProps} from '../types/screentypes';
import {Icon} from 'react-native-paper';
// import {HomeStack} from './HomeStack';
// import {FavoriteMovieScreen} from '../screens/FavoriteMovieScreen';
// import { ProfileStack } from './ProfileStack';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const MainTabs: React.FC<MainTabsProps> = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={{
        tabBarActiveTintColor: '#FF8133',
        tabBarInactiveTintColor: 'white',
        tabBarStyle: {
          backgroundColor: '#3D3D3D',
        },
      }}>
      {/* <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Icon source="home" size={size} color={color} />
          ),
          headerShown: false,
        }}
      /> */}
      {/* <Tab.Screen
        name="FavoriteTab"
        component={FavoriteMovieScreen}
        options={{
          tabBarLabel: 'Favorite',
          tabBarIcon: ({color, size}) => (
            <Icon source="heart-circle" size={size} color={color} />
          ),
          headerShown: false,
        }}
      /> */}
      {/* <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Customer',
          tabBarIcon: ({color, size}) => (
            <Icon source="account" size={size} color={color} />
          ),
          headerShown: false,
        }}
      /> */}
      {/*<Tab.Screen
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
