import {
  //refresh
  REFRESH_START,
  REFRESH_DAILY_LIST,
  REFRESH_PAST_LIST,
  REFRESH_TODAY_LIST,
  REFRESH_FUTURE_LIST,
  REFRESH_ALL_LISTS
} from '../types';
//interfaces
import {SavedToDoI} from "res";

export interface ToDoReduxStateI {
  dailyToDos: SavedToDoI[],
  pastToDos: SavedToDoI[],
  todayToDos: SavedToDoI[],
  futureToDos: SavedToDoI[],
  refreshDailyList: boolean,
  refreshPastList: boolean,
  refreshTodayList: boolean,
  refreshFutureList: boolean,
  //if app refreshes
  refreshing: boolean
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
  //for app refresh
  refreshing: true
};

export default (state = initialState, action: {payload: any, type: string}) => {
  const {payload, type} = action;
  switch (type) {
    //for refresh start (end normally after any below action/type)
    case REFRESH_START: 
      return {}
    //refresh and set lists
    case REFRESH_DAILY_LIST:
      return {...state, refreshDailyList: !state.refreshDailyList, dailyToDos: payload, refreshing: false};
    case REFRESH_PAST_LIST:
      return {...state, refreshPastList: !state.refreshPastList, pastToDos: payload, refreshing: false};
    case REFRESH_TODAY_LIST:
      return {...state, refreshTodayList: !state.refreshTodayList, todayToDos: payload, refreshing: false};
    case REFRESH_FUTURE_LIST:
      return {...state, refreshFutureList: !state.refreshFutureList, futureToDos: payload, refreshing: false};
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
        refreshing: false
      };
    default:
      return state;
  }
};
