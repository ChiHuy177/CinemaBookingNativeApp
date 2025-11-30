/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {BottomTabParamList} from './BottomTabParamList';
import {MainTabsProps} from '../types/screentypes';
import {Icon} from 'react-native-paper';

import {ProfileStack} from './ProfileStack';
import {FavoriteMovieScreen} from '../screens/FavoriteMovieScreen';
import {HomeStack} from './HomeStack';

const Tab = createBottomTabNavigator<BottomTabParamList>();

// màu đồng bộ với HomeScreen / figma
const ACCENT_RED = '#FF315A';
const TAB_BG = '#171726';
const TAB_INACTIVE = '#7B7A8C';

export const MainTabs: React.FC<MainTabsProps> = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeStack"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACCENT_RED,
        tabBarInactiveTintColor: TAB_INACTIVE,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size, focused}) => (
            <View
              style={[
                styles.iconWrapper,
                focused && styles.iconWrapperActive,
              ]}>
              <Icon
                source="home"
                size={size - 4}
                color={focused ? '#FFFFFF' : color}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="FavoriteTab"
        component={FavoriteMovieScreen}
        options={{
          tabBarLabel: 'Favorite',
          tabBarIcon: ({color, size, focused}) => (
            <View
              style={[
                styles.iconWrapper,
                focused && styles.iconWrapperActive,
              ]}>
              <Icon
                source="heart-circle"
                size={size - 4}
                color={focused ? '#FFFFFF' : color}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Customer',
          tabBarIcon: ({color, size, focused}) => (
            <View
              style={[
                styles.iconWrapper,
                focused && styles.iconWrapperActive,
              ]}>
              <Icon
                source="account"
                size={size - 4}
                color={focused ? '#FFFFFF' : color}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: TAB_BG,
    borderTopWidth: 0,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: -2},
    height: 70,
    paddingBottom: 10,
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  iconWrapper: {
    width: 40,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapperActive: {
    backgroundColor: ACCENT_RED,
  },
});
