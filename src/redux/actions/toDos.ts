import Moment from 'moment';
import {ToDoDB} from 'db_vasern';
import {
  //refresh
  REFRESH_DAILY_LIST,
  REFRESH_TODAY_LIST,
  REFRESH_PAST_LIST,
  REFRESH_FUTURE_LIST,
  REFRESH_ALL_LISTS,
} from '../types';
//interfaces
import {ToDoI} from 'res';

//refresh different overview lists
export const refreshDailyList = () => {
  let toDos = ToDoDB.data() as ToDoI[];
  let sortedToDos = toDos.filter((toDo) => toDo.recurrence);
  return {
    type: REFRESH_DAILY_LIST,
    payload: sortedToDos,
  };
};

export const refreshPastList = (optionalToDos?: ToDoI[]) => {
  if (optionalToDos) {
    return {
      type: REFRESH_PAST_LIST,
      payload: optionalToDos,
    };
  }
  let toDos = ToDoDB.data() as ToDoI[];
  let orderedPastToDos = [] as {title: string; data: ToDoI[]}[];
  toDos.map((toDo) => {
    if (Moment(toDo.dateTime, '').isBefore(Moment(), 'day')) {
      insertInOrderedList(toDo, orderedPastToDos);
    }
  });
  return {
    type: REFRESH_PAST_LIST,
    payload: orderedPastToDos,
  };
};

export const refreshTodayList = (optionalToDos?: ToDoI[]) => {
  /* if (optionalToDos) {
    return {
      type: REFRESH_TODAY_LIST,
      payload: optionalToDos,
    };
  } */
  let toDos = ToDoDB.data() as ToDoI[];
  let sortedToDos = toDos.filter((toDo) =>
    Moment(toDo.dateTime).isSame(Moment(), 'day'),
  );
  return {
    type: REFRESH_TODAY_LIST,
    payload: sortedToDos,
  };
};

export const refreshFutureList = (optionalToDos?: ToDoI[]) => {
  if (optionalToDos) {
    return {
      type: REFRESH_FUTURE_LIST,
      payload: optionalToDos,
    };
  }
  let toDos = ToDoDB.data() as ToDoI[];
  let orderedFutureToDos = [] as {title: string; data: ToDoI[]}[];
  toDos.map((toDo) => {
    if (Moment(toDo.dateTime, '').isAfter(Moment(), 'day')) {
      insertInOrderedList(toDo, orderedFutureToDos);
    }
  });
  return {
    type: REFRESH_FUTURE_LIST,
    payload: orderedFutureToDos,
  };
};

export const refreshAllLists = () => {
  let toDos = ToDoDB.data() as ToDoI[];
  let dailyToDos = [] as ToDoI[];
  let orderedPastToDos = [] as {title: string; data: ToDoI[]}[];
  let todayToDos = [] as ToDoI[];
  let orderedFutureToDos = [] as {title: string; data: ToDoI[]}[];
  toDos.map((toDo) => {
    if (toDo.recurrence) {
      //all day
      dailyToDos.push(toDo);
      /* orderedPastToDos =  */ insertInOrderedList(toDo, orderedPastToDos);
      todayToDos.push(toDo);
      /* orderedFutureToDos =  */ insertInOrderedList(toDo, orderedFutureToDos);
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
    Moment(b.title, 'YYYY-MM-DD').isBefore(Moment(a.title, 'YYYY-MM-DD')),
  );
  orderedFutureToDos.sort((a, b) =>
    Moment(b.title, 'YYYY-MM-DD').isAfter(Moment(a.title, 'YYYY-MM-DD')),
  );
  return {
    type: REFRESH_ALL_LISTS,
    payload: {dailyToDos, orderedPastToDos, todayToDos, orderedFutureToDos},
  };
};

const insertInOrderedList = (
  toDo: ToDoI,
  orderedList: {title: string; data: ToDoI[]}[],
) /* : {title: string; data: ToDoI[]}[] */ => {
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
