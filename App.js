import 'react-native-gesture-handler';
import * as React from 'react';
import Navigation from './Navigation';
import AuthContextProvider from './store/AuthProvider';
import {StatusBar} from 'react-native';

const App = () => {
  return (
    <AuthContextProvider>
      <StatusBar />
      <Navigation />
    </AuthContextProvider>
  );
};
export default App;
