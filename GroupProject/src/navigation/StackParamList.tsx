import {EditClientProfileProps} from '../types/client';
import {ComboParamProps} from '../types/combo';
import {MovieBookingParamProps, MovieDetailProps} from '../types/movie';
import {SeatSelectionParamProps} from '../types/seat';
import {ShowingTimeParamProps} from '../types/showingTime';

export type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  ForgotPasswordScreen: undefined;
  ResetPasswordScreen: {email: string};
  MainTabs: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  MovieListScreen: {searchValue?: string};
  SearchScreen: undefined;
  MovieDetailScreen: {movieId: number};
  FavoriteMovieScreen: undefined;
  MovieReviewScreen: MovieDetailProps;
  ShowingTimeBookingScreen: MovieBookingParamProps;
  SeatSelectionScreen: ShowingTimeParamProps;
  ComboBookingScreen: SeatSelectionParamProps;
  MovieTicketScreen: ComboParamProps;
  TicketDetailScreen: {
    ticketId: number;
    isFromBooking: boolean;
  };
  MyTicketsScreen: undefined;
  CinemaListScreen: undefined;
  CinemaMoviesScreen: {
    cinemaId: number;
    cinemaName: string;
  };
};

export type ProfileStackParamList = {
  ProfileScreen: undefined;
  EditProfileScreen: EditClientProfileProps;
  ChangePasswordScreen: {
    email: string;
  };
  CouponListScreen: {
    clientEmail: string;
  };
};
