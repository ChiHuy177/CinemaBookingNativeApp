import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {AuthContextProps, AuthProps} from '../types/auth';
import {clearUserAndToken, getEmailAndToken} from '../utils/storage';

const AuthContext = createContext<AuthContextProps | undefined>(undefined);
export default function AuthProvider({children}: {children: React.ReactNode}) {
  const [auth, setAuth] = useState<AuthProps | null>(null);

  useEffect(() => {
    async function fetchAuth() {
      const authValue = await getEmailAndToken();
      setAuth(authValue);
    }
    fetchAuth();
  }, []);

  const saveAuth = useCallback(async () => {
    const authValue = await getEmailAndToken();
    setAuth(authValue);
  }, []);

  const removeAuth = useCallback(async () => {
    await clearUserAndToken();
    setAuth(null);
  }, []);

  return (
    <AuthContext.Provider value={{auth, saveAuth, removeAuth}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('Error getting auth context');
  }
  return context;
}
