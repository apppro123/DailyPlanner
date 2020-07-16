import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
//navigation
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//navigator
import { DailyToDosN } from './DailyToDos';
import { ToDosOverviewN } from './ToDos';
import { NewToDoStackN } from './NewToDo';
import { ChangeToDoStackN } from './ChangeToDo';
import { SettingsStackN } from "./Settings";
//types
import { BottomTabNTypes } from "./types";
//own components
import { OwnIcon, OwnView, OwnButton } from 'components';
//strings
import { DailyToDosStrings, ToDosOverviewStrings } from 'res';
const { DAILY_TODOS } = DailyToDosStrings;
const { TODOS } = ToDosOverviewStrings;

const Tab = createBottomTabNavigator<BottomTabNTypes>();

export function BottomNavigator() {
  return (
    <Tab.Navigator
      initialRouteName={'ToDosOverviewN'}
      backBehavior={'history'}
      tabBar={props => <CustomTabBar {...props} />}>
      <Tab.Screen
        name="ToDosOverviewN"
        component={ToDosOverviewN}
        options={{ tabBarLabel: TODOS }}
      />
      <Tab.Screen
        name="NewToDoN"
        component={NewToDoStackN}
        options={{ tabBarVisible: false }}
      />

      <Tab.Screen
        name="DailyToDosN"
        component={DailyToDosN}
        options={{
          tabBarLabel: DAILY_TODOS,
        }}
      />
      <Tab.Screen
        name="ChangeToDoStackN"
        component={ChangeToDoStackN}
        options={{ tabBarVisible: false }}
      />
      <Tab.Screen
        name="SettingsN"
        component={SettingsStackN}
        options={{tabBarVisible: false}}
      />
    </Tab.Navigator>
  );
}

//onw custom tabBar
function CustomTabBar({ state, descriptors, navigation }) {
  return (
    <OwnView style={styles.mainBackground}>
      {/* render settings button not in tab-bar */}
      <SettingsButton descriptors={descriptors} navigation={navigation} state={state}/>
      <OwnView style={styles.tabBarContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };
          if (index === 0) {
            let textStyle = Object.assign({}, styles.tabButtonLabel) as { fontSize: number, fontWeight: "bold" | "normal" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | undefined };
            if (isFocused) {
              textStyle.fontWeight = 'bold';
            }
            return (
              <OwnView style={styles.tabBarButtonLeftContainer} key={index}>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityStates={isFocused ? ['selected'] : []}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={styles.tabButtonLeft}>
                  <Text style={textStyle}>{label}</Text>
                </TouchableOpacity>
                <OwnView style={styles.tabPlusButtonBottomContainer} />
              </OwnView>
            );
          } else if (index === 1) {
            return (
              <OwnView key={index} style={styles.tabPlusButtonContainer}>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityStates={isFocused ? ['selected'] : []}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={styles.tabPlusButton}>
                  <OwnIcon iconSet="MaterialCommunity" name="plus" size={60} />
                </TouchableOpacity>
                <OwnView style={styles.tabPlusButtonBottomContainer}>
                  <OwnView
                    style={{
                      bottom: 10,
                      left: -12.5,
                      position: 'absolute',
                      width: 125,
                      height: 125,
                      borderRadius: 62.5,
                    }}
                  />
                </OwnView>
              </OwnView>
            );
          } else if (index === 2) {
            let textStyle = Object.assign({}, styles.tabButtonLabel) as { fontSize: number, fontWeight: "bold" | "normal" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | undefined };
            if (isFocused) {
              textStyle.fontWeight = 'bold';
            }
            return (
              <OwnView style={styles.tabBarButtonRightContainer} key={index}>
                <TouchableOpacity
                  accessibilityRole="button"
                  accessibilityStates={isFocused ? ['selected'] : []}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  testID={options.tabBarTestID}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={styles.tabButtonRight}>
                  <Text style={textStyle}>{label}</Text>
                </TouchableOpacity>
                <OwnView /* style={styles.tabBarButtonBottomContainer} */ />
              </OwnView>
            );
          }
        })}
      </OwnView>

    </OwnView>
  );
}

//render settingsButton index = 4
//has special render bc he is not in the tabBarBottom
const SettingsButton = (props) =>  {
  const {descriptors, navigation, state} = props
  const index = 4;
  const route = state.routes[index];
  const { options } = descriptors[route.key];
  const label =
    options.tabBarLabel !== undefined
      ? options.tabBarLabel
      : options.title !== undefined
        ? options.title
        : route.name;

  const isFocused = state.index === index;

  const onPress = () => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  const onLongPress = () => {
    navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    });
  };
  let textStyle = Object.assign({}, styles.tabButtonLabel) as { fontSize: number, fontWeight: "bold" | "normal" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | undefined };
  if (isFocused) {
    textStyle.fontWeight = 'bold';
  }
  return (
    <OwnView style={styles.settingsButton}>
      <TouchableOpacity
        key={index}
        accessibilityRole="button"
        accessibilityStates={isFocused ? ['selected'] : []}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarTestID}
        onPress={onPress}
        onLongPress={onLongPress}>
        <OwnIcon iconSet="MaterialCommunity" name="cog" size={60} />
      </TouchableOpacity>
    </OwnView>
  )
}

const styles = StyleSheet.create({
  mainBackground: {
    paddingTop: 50
  },
  tabBarContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  tabBarButtonLeftContainer: {
    flex: 1,
    zIndex: -2,
  },
  tabBarButtonRightContainer: {
    flex: 1,
    zIndex: -2,
  },
  //plus button
  tabPlusButtonContainer: {
    alignItems: 'center',
    width: 100,
    zIndex: -1,
    margin: -1.5,
  },
  tabPlusButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E9AFE',
    borderRadius: 30,
    width: 60,
    height: 60,
    marginBottom: 20,
  },
  //to make it look better ;)
  tabPlusButtonBottomContainer: {
    position: 'absolute',
    zIndex: -1,
    left: 0,
    bottom: 0,
    backgroundColor: '#2E9AFE',
    height: 35,
    width: 110,
  },
  //left and right tabButton
  tabButtonLabel: {
    fontSize: 20,
  },
  tabButtonLeft: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E9AFE',
    borderTopRightRadius: 25,
  },
  tabButtonRight: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E9AFE', //#81DAF5
    borderTopLeftRadius: 25,
  },
  //settings button
  settingsButton: {
    position: "absolute",
    bottom: 70,
    right: 20,
    zIndex: 10,
  }
});
