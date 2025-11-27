import {createRef} from 'react';

import {CommonActions, NavigationContainerRef} from '@react-navigation/native';
import { RootStackParamList } from '../navigation/StackParamList';

export const navigationRef =
  createRef<NavigationContainerRef<RootStackParamList>>();

export function navigate(name: keyof RootStackParamList, params?: any) {
  if (navigationRef.current?.isReady()) {
    navigationRef.current.navigate(name as any, params);
  }
}

export function resetToLogin() {
  console.log('Resetting to Login Screen');
  if (navigationRef.current?.isReady()) {
    console.log('Navigation is ready, dispatching reset action');
    navigationRef.current.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'LoginScreen'}],
      }),
    );
  }
}

export function resetTo(screenName: keyof RootStackParamList, params?: any) {
  if (navigationRef.current?.isReady()) {
    navigationRef.current.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: screenName as any, params}],
      }),
    );
  }
}

export function goBack() {
  if (navigationRef.current?.canGoBack()) {
    navigationRef.current.goBack();
  }
}
