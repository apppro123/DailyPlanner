import React from 'react';
//navigation
import {createNativeStackNavigator} from '@react-navigation/native-stack';
//screens
import DailyToDosOverview from './DailyToDosOverview';

const Stack = createNativeStackNavigator();

export const DailyToDosN = () => (
  <Stack.Navigator>
    <Stack.Screen name="DailyToDosOverview" component={DailyToDosOverview} />
  </Stack.Navigator>
);
