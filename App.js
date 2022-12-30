import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { store } from './src/state/store';
import Route from './src/navigation/Route';
import FlashMessage from "react-native-flash-message";

const App = () => {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <Route />
        <FlashMessage position="bottom" />
      </Provider>
    </NavigationContainer>
  );
};


export default App;
