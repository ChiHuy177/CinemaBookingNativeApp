import {NavigatorScreenParams} from '@react-navigation/native';
import {HomeStackParamList} from './StackParamList';

export type BottomTabParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  FavoriteTab: undefined;
  ProfileStack: undefined;
};
