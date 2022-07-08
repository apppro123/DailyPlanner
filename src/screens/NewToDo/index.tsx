import React from 'react';
//react navigation stack
import {createNativeStackNavigator} from '@react-navigation/native-stack';
//types
import {NewToDoStackNTypes} from '../types';
//own components
import {OwnButton, OwnIcon} from 'components';
//strings
import {Strings} from 'res';
const {NEW_TODO} = Strings;

//screen
import NewToDo from './NewToDo';

//stack navigator
const Stack = createNativeStackNavigator<NewToDoStackNTypes>();
export function NewToDoStackN() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="NewToDo"
        component={NewToDo}
        options={({navigation}) => ({
          title: NEW_TODO,
          headerLeft: () => (
            <OwnButton onPress={navigation.goBack}>
              <OwnIcon
                iconSet="MaterialCommunity"
                name="arrow-left"
                size={30}
              />
            </OwnButton>
          ),
        })}
      />
    </Stack.Navigator>
  );
}
