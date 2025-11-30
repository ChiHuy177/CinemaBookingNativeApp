import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeStackParamList} from './StackParamList';
import { HomeScreen } from '../screens/HomeScreen';
import CinemaListScreen from '../screens/CinemaListScreen';
import CinemaMoviesScreen from '../screens/CinemaMoviesScreen';
import ComboBookingScreen from '../screens/ComboBookingScreen';
import MovieDetailScreen from '../screens/MovieDetailScreen';
import MovieListScreen from '../screens/MovieListScreen';
import MovieReviewScreen from '../screens/MovieReviewScreen';
import MovieTicketScreen from '../screens/MovieTicketScreen';
import MyTicketsScreen from '../screens/MyTicketsScreen';
import { SearchScreen } from '../screens/SearchScreen';
import SeatSelectionScreen from '../screens/SeatSelectionScreen';
import ShowingTimeBookingScreen from '../screens/ShowingTimeBookingScreen';
import TicketDetailScreen from '../screens/TicketDetailScreen';
import { HomeStackProps } from '../types/screentypes';

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
