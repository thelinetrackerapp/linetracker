import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from 'react-native-elements';
import SplashScreen from 'react-native-splash-screen';

import { UserContextProvider } from './src/hooks/useUser';
import Home from './src/screens/Home';
import Login from './src/screens/Login';

const Stack = createStackNavigator();

const Comp = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <ThemeProvider>
      <UserContextProvider>
        <NavigationContainer>
          <StatusBar barStyle="light-content" backgroundColor="#202a44" />
          <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} options={defaultOptions} />
            <Stack.Screen name="Login" component={Login} options={defaultOptions} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserContextProvider>
    </ThemeProvider>
  );
};

export default Comp;

const defaultOptions = {
  title: 'Line Tracker',
  headerStyle: {
    backgroundColor: '#202a44',
  },
  headerTintColor: '#fff',
  headerBackTitleVisible: false,
};
