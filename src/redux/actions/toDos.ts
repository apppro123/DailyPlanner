import Moment from "moment";
import {
  //set
  SET_DAILY_TODOS,
  SET_PAST_TODOS,
  SET_TODAY_TODOS,
  SET_FUTURE_TODOS,
  SET_REFRESH_ALL_TODOS,
  //refresh
  REFRESH_DAILY_LIST,
  REFRESH_TODAY_LIST,
  REFRESH_PAST_LIST,
  REFRESH_FUTURE_LIST,
} from '../types';
//interfaces
import {ToDoI} from "res";

export const setDailyToDos = (newToDos: ToDoI[])  => {
  return {
    type: SET_DAILY_TODOS,
    payload: newToDos,
  };
};

export const setPastToDos = (pastToDos: ToDoI[]) => {
  return {
    type: SET_PAST_TODOS,
    payload: pastToDos,
  };
};

export const setTodayToDos = (todayToDos: ToDoI[]) => {
  return {
    type: SET_TODAY_TODOS,
    payload: todayToDos,
  };
};

export const setFutureToDos = (futureToDos: ToDoI[]) => {
  return {
    type: SET_FUTURE_TODOS,
    payload: futureToDos,
  };
};

//set all to-dos
export const setRefreshAllToDos = (allToDos: ToDoI[]) => {
  //different arrays
  let dailyToDos = [] as ToDoI[];
  let pastToDos = [] as ToDoI[];
  let todayToDos = [] as ToDoI[];
  let futureToDos = [] as ToDoI[];

  for (const toDo of allToDos) {
    //push to-do to specific days/lists
    if (toDo.daily) {
      //push to every day
      dailyToDos.push(toDo);
    } else if (Moment(toDo.dateTime).isBefore(Moment().startOf("day"))) {
      //push to past
      pastToDos.push(toDo);
    } else if (Moment(toDo.dateTime).isAfter(Moment().endOf("day"))) {
      //push to future
      futureToDos.push(toDo);
    } else {
      //push to today
      todayToDos.push(toDo);
    }
  }
  return {
    type: SET_REFRESH_ALL_TODOS,
    payload: {dailyToDos, pastToDos, todayToDos, futureToDos},
  };
};

//refresh different overview lists
export const refreshDailyList = () => {
  return {
    type: REFRESH_DAILY_LIST,
  };
};

export const refreshPastList = () => {
  return {
    type: REFRESH_PAST_LIST,
  };
};

export const refreshTodayList = () => {
  return {
    type: REFRESH_TODAY_LIST,
  };
};

export const refreshFutureList = () => {
  return {
    type: REFRESH_FUTURE_LIST,
  };
};
