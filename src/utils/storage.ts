import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthProps} from '../types/auth';

export const saveEmailAndToken = async (authData: AuthProps) => {
  await AsyncStorage.setItem('auth', JSON.stringify(authData));
};

export const getEmailAndToken = async (): Promise<AuthProps | null> => {
  const auth = await AsyncStorage.getItem('auth');
  if (!auth) {
    return null;
  }
  return JSON.parse(auth);
};

export const clearUserAndToken = async () => {
  await AsyncStorage.removeItem('auth');
};
