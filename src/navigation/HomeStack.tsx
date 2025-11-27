import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeStackParamList} from './StackParamList';

import MovieListScreen from '../screens/MovieListScreen';
import {HomeStackProps} from '../types/screentypes';
import {SearchScreen} from '../screens/SearchScreen';
import MovieDetailScreen from '../screens/MovieDetailScreen';
import MovieReviewScreen from '../screens/MovieReviewScreen';
import SeatSelectionScreen from '../screens/SeatSelectionScreen';
import ComboBookingScreen from '../screens/ComboBookingScreen';
import MovieTicketScreen from '../screens/MovieTicketScreen';
import ShowingTimeBookingScreen from '../screens/ShowingTimeBookingScreen';
import TicketDetailScreen from '../screens/TicketDetailScreen';
import MyTicketsScreen from '../screens/MyTicketsScreen';
import CinemaListScreen from '../screens/CinemaListScreen';
import CinemaMoviesScreen from '../screens/CinemaMoviesScreen';
import { HomeScreen } from '../screens/HomeScreen';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStack: React.FC<HomeStackProps> = () => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="HomeScreen"
        component={HomeScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="MovieListScreen"
        component={MovieListScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="SearchScreen"
        component={SearchScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="MovieDetailScreen"
        component={MovieDetailScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="MovieReviewScreen"
        component={MovieReviewScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="ShowingTimeBookingScreen"
        component={ShowingTimeBookingScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="SeatSelectionScreen"
        component={SeatSelectionScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="ComboBookingScreen"
        component={ComboBookingScreen}
      />

      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="MovieTicketScreen"
        component={MovieTicketScreen}
      />

      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="TicketDetailScreen"
        component={TicketDetailScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="MyTicketsScreen"
        component={MyTicketsScreen}
      />

      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="CinemaListScreen"
        component={CinemaListScreen}
      />

      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="CinemaMoviesScreen"
        component={CinemaMoviesScreen}
      />
    </Stack.Navigator>
  );
};
