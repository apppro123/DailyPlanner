import React from 'react';
import { StyleSheet, Dimensions, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
//library for time/date/...
import Moment from 'moment';
//vasern db
import VasernDB, { ToDoDB } from "db_vasern";
//where screens get loaded
import Main from './src';
//redux
import { Provider } from 'react-redux';
import store from './src/redux/store';
import { refreshAllLists, startRefreshing } from "./src/redux/actions";
//interfaces
import { SavedToDoI } from 'res';
import { ActivityIndicator } from 'react-native';

//format for moment
const FORMAT = 'DD-MM-YYYY';

const LATEST_DATE = 'latestDate';

interface StateI {
  latestDate: string,
  loadedData: boolean
}

class App extends React.Component<{}, StateI> {
  state = {
    latestDate: Moment().format(FORMAT),
    loadedData: false
  };

  componentDidMount() {
    //first call on db and set to-dos
    VasernDB.onLoaded(() => {
      //loaded vasern data
      this.setState({ loadedData: true });
      //make calculations
      this.makeCalculations();
    })
  }

  /* look if date changed and refresh ToDos if necessary */
  /* refresh ^=  refresh all views and set all-day to-dos done to false plus 
  refresh streaks if necessary (reset currentStreak to 0 if not done that day) */
  makeCalculations = async () => {
    store.dispatch(startRefreshing());
    try {
      //get last saved date
      let latestDate = await AsyncStorage.getItem(LATEST_DATE);
      if (latestDate !== null) {
        if (!Moment(latestDate, FORMAT).isSame(Moment(), 'day')) {
          /* 
          date has changed
           */
          //update date in AsyncStorage and state
          const newLatestDate = Moment().format(FORMAT);
          await AsyncStorage.setItem(LATEST_DATE, newLatestDate);

          //change all done of daily events to undone
          let toDos = ToDoDB.data() as SavedToDoI[];
          for (const toDo of toDos) {
            if (toDo.recurrence_id && toDo.done === true) {
              await ToDoDB.update(toDo.id, { done: false })
            }
          }
          //refresh views
          store.dispatch(refreshAllLists());
        } else {
          /*
          date has not changed
          */
          //get and set to-dos
          store.dispatch(refreshAllLists());
        }
      } else {
        /*
        LATEST_DATE not set => first launch of application
        */
        const newLatestDate = Moment().format(FORMAT);
        await AsyncStorage.setItem(LATEST_DATE, newLatestDate);
      }
    } catch (error) {
      alert('Sorry, an error occured!');
    }
  };

  //have to build a button to refresh views and date
  refreshAndCheckDate = async () => {
    let latestDate = await AsyncStorage.getItem(LATEST_DATE);
    //check date
    if (!Moment(latestDate, FORMAT).isSame(Moment(), 'day')) {
      /* 
      date has changed
       */
      //update date in AsyncStorage and state
      const newLatestDate = Moment().format(FORMAT);
      await AsyncStorage.setItem(LATEST_DATE, newLatestDate);

      //change all done of daily events to undone
      let toDos = ToDoDB.data() as SavedToDoI[];
      for (const toDo of toDos) {
        if (toDo.recurrence_id && toDo.done === true) {
          await ToDoDB.update(toDo.id, { done: false })
        }
      }
      //refresh views
      store.dispatch(refreshAllLists());
    } else {
      /*
      date has not changed
      */
      //get and set to-dos
      store.dispatch(refreshAllLists());
    }
  }

  render() {
    return (
      <Provider store={store}>
        {store.getState().toDos.refreshing &&
          <View style={styles.activityIndicatorContainer}>
            <ActivityIndicator />
          </View>}
        {this.state.loadedData && <Main />}
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  activityIndicatorContainer: {
    position: "absolute",
    left: Dimensions.get("screen").width / 2 - 10,
    top: 100
  }
})

export default App;