import Realm from 'realm';
import {TODO} from '../Schemas';
import {schemas} from '../dbOptions';
//interfaces
import {ToDoI} from 'res';
//latest schema 
const latestSchema = schemas[schemas.length-1]

export const insertNewToDo = (newToDo: ToDoI) =>
  new Promise((resolve, reject) => {
    Realm.open(latestSchema)
      .then(realm => {
        realm.write(() => {
          realm.create(TODO, newToDo);
          resolve();
        });
      })
      .catch(error => reject(error));
  });

export const updateToDo = (newToDo: ToDoI) =>
  new Promise<ToDoI[]>((resolve, reject) => {
    Realm.open(latestSchema)
      .then(realm => {
        realm.write(() => {
          const {name, notes, done, daily} = newToDo;
          let updatingToDo = realm.objectForPrimaryKey(
            TODO,
            newToDo.id,
          ) as ToDoI;
          updatingToDo.name = name;
          updatingToDo.notes = notes;
          updatingToDo.daily = daily;
          updatingToDo.done = done;
          //get and return all to-dos
          const allToDos = realm.objects<ToDoI>(TODO);
          resolve(realmObjectToArray(allToDos));
        });
      })
      .catch(error => reject(error));
  });

//update only curtain properties of to-do
export const updateOnlyDone = (done: boolean, id: string) =>
  new Promise((resolve, reject) => {
    Realm.open(latestSchema)
      .then(realm => {
        realm.write(() => {
          let updatingToDo = realm.objectForPrimaryKey(TODO, id) as ToDoI;
          updatingToDo.done = done;
        });
      })
      .catch(error => reject(error));
  });

export const updateOnlyDate = (id: string, newDate: Date) =>
  new Promise((resolve, reject) => {
    Realm.open(latestSchema)
      .then(realm => {
        realm.write(() => {
          let updatingToDo = realm.objectForPrimaryKey(TODO, id) as ToDoI;
          updatingToDo.date = newDate;
          resolve();
        });
      })
      .catch(error => reject(error));
  });

export const deleteToDo = (id: string) =>
  new Promise((resolve, reject) => {
    Realm.open(latestSchema)
      .then(realm => {
        realm.write(() => {
          let deletingToDo = realm.objectForPrimaryKey(TODO, id);
          realm.delete(deletingToDo);
          resolve();
        });
      })
      .catch(error => reject(error));
  });

export const getToDoById = (id: string) =>
  new Promise<ToDoI>((resolve, reject) => {
    Realm.open(latestSchema)
      .then(realm => {
        const allToDos = realm.objects<ToDoI>(TODO);
        const toDoById = allToDos.filtered('id == $0', id)[0];
        resolve(toDoById);
      })
      .catch(error => reject(error));
  });

export const getAllToDos = () =>
  new Promise<ToDoI[]>((resolve, reject) => {
    Realm.open(latestSchema)
      .then(realm => {
        const rawAllToDos = realm.objects<ToDoI>(TODO);
        resolve(realmObjectToArray(rawAllToDos)); 
      })
      .catch(error => reject(error));
  });

/* export const getAllDaysDone = () =>
  new Promise<DaysDoneI[]>((resolve, reject) => {
    Realm.open(latestSchema)
      .then(realm => {
        const allDaysDone = realm.objects<DaysDoneI>(DAYS_DONE);
        resolve(Array.from(allDaysDone));
      })
      .catch(error => reject(error));
  }); */

//delete daily to-do and maybe make new ones for the selected days
export const deleteDailyToDo = (idToDelete: string, newToDos: ToDoI[]) =>
  new Promise((resolve, reject) => {
    Realm.open(latestSchema)
      .then(realm => {
        realm.write(() => {
          for (const newToDo of newToDos) {
            realm.create(TODO, newToDo);
          }
          //delete to-do
          let deletingToDo = realm.objectForPrimaryKey(TODO, idToDelete) as ToDoI;
          realm.delete(deletingToDo);
          resolve();
        });
      })
      .catch(error => reject(error));
  });

export const updateAfterDateChanged = () =>
  new Promise<ToDoI[]>((resolve, reject) => {
    Realm.open(latestSchema)
      .then(realm => {
        realm.write(() => {
          let allToDos = realm.objects<ToDoI>(TODO);
          //ids to to delete
          allToDos.map((toDo: ToDoI) => {
            if (toDo.daily) {
              toDo.done = false;
            }
          });
          resolve(realmObjectToArray(realm.objects<ToDoI>(TODO)));
        });
      })
      .catch(error => reject(error));
  });


//convert realm object to js array and make it mutable
export function realmObjectToArray<T> (realmObject: Realm.Results<T & Realm.Object>) {
  let realmArray = [] as T[];
  //go over realmObject
  for(const keyToDo in realmObject){
    let realmSingleObject = realmObject[keyToDo];
    //clone object
    let realmSingleClonedObject = JSON.parse(JSON.stringify(realmSingleObject));
    realmArray.push(realmSingleClonedObject);
  }
  return realmArray;
}