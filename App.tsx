import React from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
//library for time/date/...
import Moment from 'moment';
//vasern db
import VasernDB, {GroupDB, RecurrenceDB, ToDoDB} from "db_vasern";
//where screens get loaded
import Main from './src';
//redux
import { Provider } from 'react-redux';
import store from './src/redux/store';
import {refreshAllLists} from "./src/redux/actions";
//interfaces 
import {ToDoI} from "res";

//format for moment
const FORMAT = 'DD-MM-YYYY';

interface StateI {
  calculationsMade: boolean,
  latestDate: string,
  intervalId?: NodeJS.Timeout,
  loadedData: boolean
}

class App extends React.Component<{}, StateI> {
  state = {
    latestDate: Moment().format(FORMAT),
    calculationsMade: false,
    intervalId: setInterval(() => null, 60000),
    loadedData: false
  };

  componentDidMount() {
    //this.makeCalculations();
    //first call on db and set to-dos
    VasernDB.onLoaded(() => {
      store.dispatch(refreshAllLists());
      this.setState({loadedData: true})
    })
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  /* look if date changed and refresh ToDos if necessary */
  /* makeCalculations = async () => {
    const LATEST_DATE = 'latestDate';
    try {
      //get last saved date
      let latestDate = await AsyncStorage.getItem(LATEST_DATE);
      if (latestDate !== null) {
        if (!Moment(latestDate, FORMAT).isSame(Moment(), 'day')) {
          //date has changed =>
          //update to-dos 
          const allToDos: ToDoI[] = await updateAfterDateChanged();
          //update redux
          store.dispatch(setRefreshAllToDos(allToDos));
          //update date in AsyncStorage and state
          const newLatestDate = Moment().format(FORMAT);
          await AsyncStorage.setItem(LATEST_DATE, newLatestDate);
          this.state.latestDate = newLatestDate;
          this.state.intervalId = setInterval(this.checkDateChanged, 60000);
        } else {
          //date has not changed
          //get and set to-dos
          const allToDos = await getAllToDos();
          store.dispatch(setRefreshAllToDos(allToDos));
          //set latest date to state and
          //set interval (every minute) if date has changed
          this.state.latestDate = latestDate;
          this.state.intervalId = setInterval(this.checkDateChanged, 60000);
        }
      } else {
        const newLatestDate = Moment().format(FORMAT);
        this.state.latestDate = newLatestDate;
        await AsyncStorage.setItem(LATEST_DATE, newLatestDate);
        this.state.intervalId = setInterval(this.checkDateChanged, 60000);
      }
      this.setState({ calculationsMade: true });
    } catch (error) {
      alert('Sorry, an error occured!');
      this.setState({ calculationsMade: true });
    }
  }; */

  /* checkDateChanged = async () => {
    const LATEST_DATE = 'latestDate';
    //get latest date from state
    const latestDate = Moment(this.state.latestDate, FORMAT);
    if (!latestDate.isSame(Moment(), 'day')) {
      //date has changed =>
      //update to-dos and date in AsyncStorage and state
      await updateAfterDateChanged();
      const newLatestDate = Moment().format(FORMAT);
      await AsyncStorage.setItem(LATEST_DATE, newLatestDate);
      this.state.latestDate = newLatestDate;
    }
  }; */

  render() {
    return (
      <Provider store={store}>
        {this.state.loadedData && <Main />}
      </Provider>
    );
  }
}

export default App;