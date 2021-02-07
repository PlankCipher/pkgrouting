import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { UsersContext, UsersContextProvider } from './contexts/Users.js';
import Login from './screens/Login.js';
import SignUp from './screens/SignUp.js';
import Home from './screens/Home.js';
import Loading from './screens/Loading.js';

const Stack = createStackNavigator();

class App extends Component {
  static contextType = UsersContext;

  render() {
    const { gettingCurrentUser, isLoggedIn } = this.context;

    return (
      <NavigationContainer>
        <Stack.Navigator>
          {gettingCurrentUser ? (
            <Stack.Screen
              name="Loading"
              options={{ headerShown: false }}
              component={Loading}
            />
          ) : isLoggedIn ? (
            <Stack.Screen
              name="Home"
              options={{ headerShown: false }}
              component={Home}
            />
          ) : (
            <>
              <Stack.Screen
                name="Login"
                options={{ headerShown: false }}
                component={Login}
              />
              <Stack.Screen
                name="SignUp"
                options={{ headerShown: false }}
                component={SignUp}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

export default () => {
  return (
    <UsersContextProvider>
      <App />
    </UsersContextProvider>
  );
};
