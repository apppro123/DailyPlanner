import React from 'react';
import { AsyncStorage } from "react-native";
//library for time/date/...
import Moment from 'moment';
//vasern db
import VasernDB, { ToDoDB } from "db_vasern";
//where screens get loaded
import Main from './src';
//redux
import { Provider } from 'react-redux';
import store from './src/redux/store';
import { refreshAllLists } from "./src/redux/actions";

//format for moment
const FORMAT = 'DD-MM-YYYY';

interface StateI {
  calculationsMade: boolean,
  latestDate: string,
  timeoutId?: NodeJS.Timeout,
  loadedData: boolean
}

class App extends React.Component<{}, StateI> {
  state = {
    latestDate: Moment().format(FORMAT),
    calculationsMade: false,
    timeoutId: undefined as undefined | NodeJS.Timeout,
    loadedData: false
  };

  componentDidMount() {

    //this.makeCalculations();

    //first call on db and set to-dos
    VasernDB.onLoaded(() => {
      store.dispatch(refreshAllLists());
      this.setState({ loadedData: true })
    })
  }

  componentWillUnmount() {
    const { timeoutId } = this.state;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }

  /* look if date changed and refresh ToDos if necessary */
  /* refresh ^=  refresh all views and set all-day to-dos done to false plus 
  refresh streaks if necessary (reset currentStreak to 0 if not done that day) */
  makeCalculations = async () => {
    const LATEST_DATE = 'latestDate';
    try {
      //get last saved date
      let latestDate = await AsyncStorage.getItem(LATEST_DATE);
      if (latestDate !== null) {
        if (!Moment(latestDate, FORMAT).isSame(Moment(), 'day')) {
          /* 
          refresh
           */
          //update date in AsyncStorage and state
          const newLatestDate = Moment().format(FORMAT);
          await AsyncStorage.setItem(LATEST_DATE, newLatestDate);
          //get milliseconds from now to end of day
          let diffToDayEnd = Moment().endOf("day").diff(Moment());
          //call function to refresh at end of day
          this.state.timeoutId = setTimeout(this.changeToDosNewDay, diffToDayEnd);
        } else {
          //date has not changed
          //get and set to-dos
          store.dispatch(refreshAllLists());
          //get milliseconds from now to end of day
          let diffToDayEnd = Moment().endOf("day").diff(Moment());
          // call function to refresh at end of day
          this.state.timeoutId = setTimeout(this.changeToDosNewDay, diffToDayEnd);
        }
      } else {
        //LATEST_DATE not set => first launch of application
        const newLatestDate = Moment().format(FORMAT);
        await AsyncStorage.setItem(LATEST_DATE, newLatestDate);
        //get milliseconds from now to end of day
        let diffToDayEnd = Moment().endOf("day").diff(Moment());
        // call function to refresh at end of day
        this.state.timeoutId = setTimeout(this.changeToDosNewDay, diffToDayEnd);
      }
      this.setState({ calculationsMade: true });
    } catch (error) {
      alert('Sorry, an error occured!');
      this.setState({ calculationsMade: true });
    }
  };

  changeToDosNewDay = () => {
    //change allDay done and streaks

    //refresh views
  }

  render() {
    return (
      <Provider store={store}>
        {this.state.loadedData && <Main />}
      </Provider>
    );
  }
}

export default App;