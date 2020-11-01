import {
  //set
  SET_REFRESH_ALL_TODOS,
  //refresh
  REFRESH_DAILY_LIST,
  REFRESH_PAST_LIST,
  REFRESH_TODAY_LIST,
  REFRESH_FUTURE_LIST,
  REFRESH_ALL_LISTS
} from '../types';
//interfaces
import {ToDoI} from "res";

export interface ToDoReduxStateI {
  dailyToDos: ToDoI[],
  pastToDos: ToDoI[],
  todayToDos: ToDoI[],
  futureToDos: ToDoI[],
  refreshDailyList: boolean,
  refreshPastList: boolean,
  refreshTodayList: boolean,
  refreshFutureList: boolean
}

const initialState: ToDoReduxStateI = {
  dailyToDos: [],
  pastToDos: [],
  todayToDos: [],
  futureToDos: [],
  //to refresh different overview lists
  //just a boolean which changes when list should refresh
  refreshDailyList: false,
  refreshPastList: false,
  refreshTodayList: false,
  refreshFutureList: false,
};

export default (state = initialState, action: {payload: any, type: string}) => {
  const {payload, type} = action;
  console.log("reducer");
  switch (type) {
    //refresh and set lists
    case REFRESH_DAILY_LIST:
      return {...state, refreshDailyList: !state.refreshDailyList, dailyToDos: payload};
    case REFRESH_PAST_LIST:
      return {...state, refreshPastList: !state.refreshPastList, pastToDos: payload};
    case REFRESH_TODAY_LIST:
      console.log("REFRESH_TODAY_LIST")
      return {...state, refreshTodayList: !state.refreshTodayList, todayToDos: payload};
    case REFRESH_FUTURE_LIST:
      return {...state, refreshFutureList: !state.refreshFutureList, futureToDos: payload};
    //sets all to-dos and refreshes all list
    case REFRESH_ALL_LISTS:
      let {dailyToDos, orderedPastToDos, todayToDos, orderedFutureToDos} = payload;
      return {
        ...state,
        dailyToDos,
        pastToDos: orderedPastToDos,
        todayToDos,
        futureToDos: orderedFutureToDos,
        refreshDailyList: !state.refreshDailyList,
        refreshPastList: !state.refreshPastList,
        refreshTodayList: !state.refreshTodayList,
        refreshFutureList: !state.refreshFutureList,
      };
    default:
      return state;
  }
};
