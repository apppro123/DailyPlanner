import React from 'react';
//react navigation stack
import {createStackNavigator} from '@react-navigation/stack';
//types
import {SettingsStackNTypes} from "../types";
//own components
import {OwnButton, OwnIcon} from 'components';
//strings
import {SettingStrings} from 'res';
const {SETTINGS} = SettingStrings;

//screen
import SettingsOverview from "./SettingsOverview";

//stack navigator
const Stack = createStackNavigator<SettingsStackNTypes>();
export function SettingsStackN() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SettingsOverview"
        component={SettingsOverview}
        options={({navigation}) => ({
          title: SETTINGS,
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

