import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {RouteProp} from '@react-navigation/native';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {BottomTabParamList} from '../navigation/BottomTabParamList';
import {
  HomeStackParamList,
  ProfileStackParamList,
  RootStackParamList,
} from '../navigation/StackParamList';

// -------------------------------------

export type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'LoginScreen'>;
  route: RouteProp<RootStackParamList, 'LoginScreen'>;
};

export type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'RegisterScreen'>;
  route: RouteProp<RootStackParamList, 'RegisterScreen'>;
};

export type ForgotPasswordScreenProps = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'ForgotPasswordScreen'
  >;
  route: RouteProp<RootStackParamList, 'ForgotPasswordScreen'>;
};

export type ResetPasswordScreenProps = {
  navigation: NativeStackNavigationProp<
    RootStackParamList,
    'ResetPasswordScreen'
  >;
  route: RouteProp<RootStackParamList, 'ResetPasswordScreen'>;
};

export type MainTabsProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;
  route: RouteProp<RootStackParamList, 'MainTabs'>;
};
// -------------------------------------

// -------------------------------------
export type HomeStackProps = {
  navigation: BottomTabNavigationProp<BottomTabParamList, 'HomeStack'>;
  route: RouteProp<BottomTabParamList, 'HomeStack'>;
};

export type HomeScreenProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'HomeScreen'>;
  route: RouteProp<HomeStackParamList, 'HomeScreen'>;
};

export type MovieListScreenProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'MovieListScreen'>;
  route: RouteProp<HomeStackParamList, 'MovieListScreen'>;
};

export type SearchScreenProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'SearchScreen'>;
  route: RouteProp<HomeStackParamList, 'SearchScreen'>;
};

export type MovieDetailScreenProps = {
  navigation: NativeStackNavigationProp<
    HomeStackParamList,
    'MovieDetailScreen'
  >;
  route: RouteProp<HomeStackParamList, 'MovieDetailScreen'>;
};

export type FavoriteMovieScreenProps = {
  navigation: NativeStackNavigationProp<
    HomeStackParamList,
    'FavoriteMovieScreen'
  >;
  route: RouteProp<HomeStackParamList, 'FavoriteMovieScreen'>;
};

export type MovieReviewScreenProps = {
  navigation: NativeStackNavigationProp<
    HomeStackParamList,
    'MovieReviewScreen'
  >;
  route: RouteProp<HomeStackParamList, 'MovieReviewScreen'>;
};

export type ShowingTimeBookingScreenProps = {
  navigation: NativeStackNavigationProp<
    HomeStackParamList,
    'ShowingTimeBookingScreen'
  >;
  route: RouteProp<HomeStackParamList, 'ShowingTimeBookingScreen'>;
};

export type SeatSelectionScreenProps = {
  navigation: NativeStackNavigationProp<
    HomeStackParamList,
    'SeatSelectionScreen'
  >;
  route: RouteProp<HomeStackParamList, 'SeatSelectionScreen'>;
};

export type ComboBookingScreenProps = {
  navigation: NativeStackNavigationProp<
    HomeStackParamList,
    'ComboBookingScreen'
  >;
  route: RouteProp<HomeStackParamList, 'ComboBookingScreen'>;
};

export type MovieTicketScreenProps = {
  navigation: NativeStackNavigationProp<
    HomeStackParamList,
    'MovieTicketScreen'
  >;
  route: RouteProp<HomeStackParamList, 'MovieTicketScreen'>;
};

export type TicketDetailScreenProps = {
  navigation: NativeStackNavigationProp<
    HomeStackParamList,
    'TicketDetailScreen'
  >;
  route: RouteProp<HomeStackParamList, 'TicketDetailScreen'>;
};

export type MyTicketsScreenProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'MyTicketsScreen'>;
  route: RouteProp<HomeStackParamList, 'MyTicketsScreen'>;
};

export type CinemaListScreenProps = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'CinemaListScreen'>;
  route: RouteProp<HomeStackParamList, 'CinemaListScreen'>;
};

export type CinemaMoviesScreenProps = {
  navigation: NativeStackNavigationProp<
    HomeStackParamList,
    'CinemaMoviesScreen'
  >;
  route: RouteProp<HomeStackParamList, 'CinemaMoviesScreen'>;
};

// -------------------------------------
export type FavoriteScreenProps = {
  navigation: BottomTabNavigationProp<BottomTabParamList, 'FavoriteTab'>;
  route: RouteProp<BottomTabParamList, 'FavoriteTab'>;
};
// -------------------------------------

// -------------------------------------

export type ProfileStackProps = {
  navigation: BottomTabNavigationProp<BottomTabParamList, 'ProfileStack'>;
  route: RouteProp<BottomTabParamList, 'ProfileStack'>;
};

export type ProfileScreenProps = {
  navigation: NativeStackNavigationProp<ProfileStackParamList, 'ProfileScreen'>;
  route: RouteProp<ProfileStackParamList, 'ProfileScreen'>;
};

export type EditProfileScreenProps = {
  navigation: NativeStackNavigationProp<
    ProfileStackParamList,
    'EditProfileScreen'
  >;
  route: RouteProp<ProfileStackParamList, 'EditProfileScreen'>;
};

export type ChangePasswordScreenProps = {
  navigation: NativeStackNavigationProp<
    ProfileStackParamList,
    'ChangePasswordScreen'
  >;
  route: RouteProp<ProfileStackParamList, 'ChangePasswordScreen'>;
};

export type CouponListScreenProps = {
  navigation: NativeStackNavigationProp<
    ProfileStackParamList,
    'CouponListScreen'
  >;
  route: RouteProp<ProfileStackParamList, 'CouponListScreen'>;
};

// -------------------------------------
