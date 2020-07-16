import {
  //set
  SET_DAILY_TODOS,
  SET_TODAY_TODOS,
  SET_PAST_TODOS,
  SET_FUTURE_TODOS,
  SET_REFRESH_ALL_TODOS,
  //refresh
  REFRESH_DAILY_LIST,
  REFRESH_PAST_LIST,
  REFRESH_TODAY_LIST,
  REFRESH_FUTURE_LIST,
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
  switch (type) {
    //set lists
    case SET_DAILY_TODOS:
      return {...state, dailyToDos: payload};
    case SET_PAST_TODOS:
      return {...state, pastToDos: payload};
    case SET_TODAY_TODOS:
      return {...state, todayToDos: payload};
    case SET_FUTURE_TODOS:
      return {...state, futureToDos: payload};
    //refresh lists
    case REFRESH_DAILY_LIST:
      return {...state, refreshDailyList: !state.refreshDailyList};
    case REFRESH_PAST_LIST:
      return {...state, refreshPastList: !state.refreshPastList};
    case REFRESH_TODAY_LIST:
      return {...state, refreshTodayList: !state.refreshTodayList};
    case REFRESH_FUTURE_LIST:
      return {...state, refreshFutureList: !state.refreshFutureList};
    //sets all to-dos and refreshes all list
    case SET_REFRESH_ALL_TODOS:
      let {dailyToDos, pastToDos, todayToDos, futureToDos} = payload;
      return {
        ...state,
        dailyToDos,
        pastToDos,
        todayToDos,
        futureToDos,
        refreshDailyList: !state.refreshDailyList,
        refreshPastList: !state.refreshPastList,
        refreshTodayList: !state.refreshTodayList,
        refreshFutureList: !state.refreshFutureList,
      };
    default:
      return state;
  }
};
