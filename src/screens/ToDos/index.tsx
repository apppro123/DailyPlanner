import React from 'react';
//navigation
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
//types
import { ToDosOverviewMaterialTopTabNTypes } from "../types";
//screens
import YesterdayOverview from './YesterdayOverview';
import TodayOverview from './TodayOverview';
import TomorrowOverview from './TomorrowOverview';
//strings
import { ToDosOverviewStrings } from 'res';
const { YESTERDAY, TODAY, TOMORROW } = ToDosOverviewStrings;

const Tab = createMaterialTopTabNavigator<ToDosOverviewMaterialTopTabNTypes>();

export const ToDosOverviewN = () => (
  <Tab.Navigator initialRouteName={'Today'}>
    <Tab.Screen
      name="Yesterday"
      options={{tabBarLabel: YESTERDAY}}
      component={YesterdayOverview}
    />
    <Tab.Screen name="Today" options={{tabBarLabel: TODAY}} component={TodayOverview} />
    <Tab.Screen
      name="Tomorrow"
      options={{tabBarLabel: TOMORROW}}
      component={TomorrowOverview}
    />
  </Tab.Navigator>
);
