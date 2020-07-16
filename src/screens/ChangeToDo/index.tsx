import React from 'react';
//react navigation stack
import {createStackNavigator} from '@react-navigation/stack';

//screen
import ChangeToDo from "./ChangeToDo";

//stack navigator
const Stack = createStackNavigator();

export function ChangeToDoStackN() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ChangeToDo"
        component={ChangeToDo}
      />
    </Stack.Navigator>
  );
}

