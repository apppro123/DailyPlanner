import Moment from 'moment';
import {ToDoDB} from 'db_vasern';
import {
  //refresh
  REFRESH_START,
  REFRESH_DAILY_LIST,
  REFRESH_TODAY_LIST,
  REFRESH_PAST_LIST,
  REFRESH_FUTURE_LIST,
  REFRESH_ALL_LISTS,
} from '../types';
//interfaces
import {SavedToDoI} from 'res';

export const startRefreshing =() => {
  return {
    type: REFRESH_START
  }
}

//refresh different overview lists
export const refreshDailyList = () => {
  let toDos = ToDoDB.data() as SavedToDoI[];
  let sortedToDos = toDos.filter((toDo) => toDo.recurrence_id);
  return {
    type: REFRESH_DAILY_LIST,
    payload: sortedToDos,
  };
};

export const refreshPastList = () => {
  let toDos = ToDoDB.data() as SavedToDoI[];
  let orderedPastToDos = [] as {title: string; data: SavedToDoI[]}[];
  toDos.map((toDo) => {
    if (Moment(toDo.dateTime, '').isBefore(Moment(), 'day') && !toDo.recurrence_id) {
      insertInOrderedList(toDo, orderedPastToDos);
    }
  });
  orderedPastToDos.sort((a, b) =>
    Moment(b.title, 'YYYY-MM-DD').isAfter(Moment(a.title, 'YYYY-MM-DD')),
  );
  return {
    type: REFRESH_PAST_LIST,
    payload: orderedPastToDos,
  };
};

export const refreshTodayList = () => {
  let toDos = ToDoDB.data() as SavedToDoI[];
  let sortedToDos = toDos.filter((toDo) =>
    Moment(toDo.dateTime).isSame(Moment(), 'day') && !toDo.recurrence_id
  );
  return {
    type: REFRESH_TODAY_LIST,
    payload: sortedToDos,
  };
};

export const refreshFutureList = () => {
  let toDos = ToDoDB.data() as SavedToDoI[];
  let orderedFutureToDos = [] as {title: string; data: SavedToDoI[]}[];
  toDos.map((toDo) => {
    if (Moment(toDo.dateTime, '').isAfter(Moment(), 'day') && !toDo.recurrence_id) {
      insertInOrderedList(toDo, orderedFutureToDos);
    }
  });
  orderedFutureToDos.sort((a, b) =>
    Moment(b.title, 'YYYY-MM-DD').isBefore(Moment(a.title, 'YYYY-MM-DD')),
  );
  return {
    type: REFRESH_FUTURE_LIST,
    payload: orderedFutureToDos,
  };
};

export const refreshAllLists = () => {
  let toDos = ToDoDB.data() as SavedToDoI[];
  let dailyToDos = [] as SavedToDoI[];
  let orderedPastToDos = [] as {title: string; data: SavedToDoI[]}[];
  let todayToDos = [] as SavedToDoI[];
  let orderedFutureToDos = [] as {title: string; data: SavedToDoI[]}[];
  toDos.map((toDo) => {
    if (toDo.recurrence_id) {
      //all day
      dailyToDos.push(toDo);
    } else {
      //not all day
      //test past/today/future
      if (Moment(toDo.dateTime, '').isBefore(Moment(), 'day')) {
        //past
        /* orderedPastToDos =  */ insertInOrderedList(toDo, orderedPastToDos);
      } else if (Moment(toDo.dateTime, '').isSame(Moment(), 'day')) {
        //today
        todayToDos.push(toDo);
      } else if (Moment(toDo.dateTime, '').isAfter(Moment(), 'day')) {
        //future
        /* orderedFutureToDos =  */ insertInOrderedList(
          toDo,
          orderedFutureToDos,
        );
      }
    }
  });
  //for some reason it is working so I won't touch that code anymore :)
  orderedPastToDos.sort((a, b) =>
    Moment(b.title, 'YYYY-MM-DD').isAfter(Moment(a.title, 'YYYY-MM-DD')),
  );
  orderedFutureToDos.sort((a, b) =>
    Moment(b.title, 'YYYY-MM-DD').isBefore(Moment(a.title, 'YYYY-MM-DD')),
  );
  return {
    type: REFRESH_ALL_LISTS,
    payload: {dailyToDos, orderedPastToDos, todayToDos, orderedFutureToDos},
  };
};

const insertInOrderedList = (
  toDo: SavedToDoI,
  orderedList: {title: string; data: SavedToDoI[]}[],
) /* : {title: string; data: SavedToDoI[]}[] */ => {
  const formattedDate = Moment(toDo.dateTime).format('YYYY-MM-DD');
  //if a date is already in orderedFutureToDos
  if (orderedList.length === 0) {
    orderedList.push({title: formattedDate, data: [toDo]});
    return orderedList;
  }
  //by default not found
  let dateIndexInList = -1;
  for (let i = 0; i < orderedList.length; i++) {
    if (orderedList[i].title === formattedDate) {
      dateIndexInList = i;
      break;
    }
  }
  if (dateIndexInList > -1) {
    orderedList[dateIndexInList].data.push(toDo);
  } else {
    orderedList.push({title: formattedDate, data: [toDo]});
  }
  //      return orderedList
};