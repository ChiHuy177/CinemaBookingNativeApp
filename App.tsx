import 'react-native-gesture-handler';
import AuthProvider from './src/context/AuthContext';
import SpinnerProvider from './src/context/SpinnerContext';
import StackNavigator from './src/navigation/StackNavigation';

function App() {
  return (
    <SpinnerProvider>
      <AuthProvider>
        <StackNavigator />
      </AuthProvider>
    </SpinnerProvider>
  );
}

export default App;
