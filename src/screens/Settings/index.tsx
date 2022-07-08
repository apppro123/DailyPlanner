import React from 'react';
//react navigation stack
import {createNativeStackNavigator} from '@react-navigation/native-stack';
//types
import {SettingsStackNTypes} from '../types';
//own components
import {OwnButton, OwnIcon} from 'components';
//strings
import {SettingStrings} from 'res';
const {SETTINGS, GROUPS} = SettingStrings;

//screen
import SettingsOverview from './SettingsOverview';
import GroupsOverview from './Groups/GroupsOverview';
import Group from './Groups/Group';

//stack navigator
const Stack = createNativeStackNavigator<SettingsStackNTypes>();
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
      {/* groups */}
      <Stack.Screen
        name="GroupsOverview"
        component={GroupsOverview}
        options={({navigation}) => ({
          title: GROUPS,
          headerLeft: () => (
            <OwnButton onPress={navigation.goBack}>
              <OwnIcon
                iconSet="MaterialCommunity"
                name="arrow-left"
                size={30}
              />
            </OwnButton>
          ),
          headerRight: () => (
            <OwnButton
              onPress={() =>
                navigation.navigate('Group', {mode: 'new', addDisabled: true})
              }>
              <OwnIcon iconSet="MaterialCommunity" name="plus" size={30} />
            </OwnButton>
          ),
        })}
      />
      <Stack.Screen
        name="Group"
        component={Group}
        options={({navigation}) => ({
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
