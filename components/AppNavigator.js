import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import MainMenuScreen from '../screens/MainMenuScreen';
import GameScreen from '../screens/GameScreen';
import LeaderboardScreen from '../screens/LeaderboardScreen';
import AboutScreen from '../screens/AboutScreen';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="MainMenu"
        screenOptions={{
          headerShown: false, //removes annoying header
        }}>
        <Stack.Screen name="MainMenu" component={MainMenuScreen} options={{ title: 'Main Menu' }} />
        <Stack.Screen name="Game" component={GameScreen} options={{ title: 'Game' }} />
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{ title: 'Leaderboard' }} />
        <Stack.Screen name="About" component={AboutScreen} options={{ title: 'About' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
