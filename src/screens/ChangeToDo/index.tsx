import React from 'react';
//react navigation stack
import {createNativeStackNavigator} from '@react-navigation/native-stack';

//screen
import ChangeToDo from './ChangeToDo';

//stack navigator
const Stack = createNativeStackNavigator();

export function ChangeToDoStackN() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ChangeToDo" component={ChangeToDo} />
    </Stack.Navigator>
  );
}
