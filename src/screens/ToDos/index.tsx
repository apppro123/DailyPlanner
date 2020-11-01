import React from 'react';
//navigation
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
//types
import { ToDosOverviewMaterialTopTabNTypes } from "../types";
//screens
import PastOverview from './PastOverview';
import TodayOverview from './TodayOverview';
import FutureOverview from './FutureOverview';
//strings
import { ToDosOverviewStrings } from 'res';
const { PAST, TODAY, FUTURE } = ToDosOverviewStrings;

const Tab = createMaterialTopTabNavigator<ToDosOverviewMaterialTopTabNTypes>();

export const ToDosOverviewN = () => (
  <Tab.Navigator initialRouteName={'Today'}>
    <Tab.Screen
      name="Past"
      options={{tabBarLabel: PAST}}
      component={PastOverview}
    />
    <Tab.Screen name="Today" options={{tabBarLabel: TODAY}} component={TodayOverview} />
    <Tab.Screen
      name="Future"
      options={{tabBarLabel: FUTURE}}
      component={FutureOverview}
    />
  </Tab.Navigator>
);
