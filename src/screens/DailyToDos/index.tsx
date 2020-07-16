import React from 'react';
//navigation
import {createStackNavigator} from '@react-navigation/stack';
//screens
import DailyToDosOverview from './DailyToDosOverview';

const Stack = createStackNavigator();

export const DailyToDosN = () => (
  <Stack.Navigator>
    <Stack.Screen name="DailyToDosOverview" component={DailyToDosOverview} />
  </Stack.Navigator>
);
