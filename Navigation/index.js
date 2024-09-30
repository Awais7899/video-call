import * as React from 'react';
import {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Loginscreen, Signupscreen, Home} from '../screens';
import {AuthContext} from '../store/AuthProvider';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

const Stack = createStackNavigator();

const prefix = 'videocall://';

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Loginscreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="signup"
        component={Signupscreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
function AuthenticatedStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
function Navigation() {
  const {authToken, isLoading} = useContext(AuthContext);

  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        Home: 'home',
      },
    },
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="small" animating={isLoading} />
      </View>
    );
  }
  return (
    <NavigationContainer linking={linking}>
      {authToken ? <AuthenticatedStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
export default Navigation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
