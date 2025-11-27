/* eslint-disable react-native/no-inline-styles */
import {createContext, useCallback, useContext, useState} from 'react';
import {SpinnerProps} from '../types/spinner';
import Spinner from 'react-native-loading-spinner-overlay';
const SpinnerContext = createContext<SpinnerProps | undefined>(undefined);
export default function SpinnerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const showSpinner = useCallback(() => {
    setIsLoading(true);
  }, []);

  const hideSpinner = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <SpinnerContext.Provider value={{hideSpinner, showSpinner}}>
      <Spinner
        visible={isLoading}
        textStyle={{color: '#FFF'}}
        overlayColor="rgba(0,0,0,0.6)"
      />
      {children}
    </SpinnerContext.Provider>
  );
}

export function useSpinner() {
  const context = useContext(SpinnerContext);
  if (!context) {
    throw new Error('Error getting spinner context');
  }
  return context;
}
