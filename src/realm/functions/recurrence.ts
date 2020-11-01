/* import Realm from 'realm';
import {RECURRENCE} from '../Schemas';
import {schemas} from '../dbOptions';
//function to get array from realm object
import {realmObjectToArray} from './toDo';
//interfaces
import {RecurrenceI} from 'res';
//latest schema
const latestSchema = schemas[schemas.length - 1];

export const insertNewRecurrence = (newRecurrence: RecurrenceI) =>
  new Promise((resolve, reject) => {
    Realm.open(latestSchema)
      .then((realm) => {
        realm.write(() => {
          realm.create(RECURRENCE, newRecurrence);
          resolve();
        });
      })
      .catch((error) => reject(error));
  });

  export const deleteRecurrence = (id: string) => 
    new Promise((resolve, reject) => {
      Realm.open(latestSchema)
      .then((realm) => {
        realm.write(() => {
          let deletingRecurrence = realm.objectForPrimaryKey(RECURRENCE, id);
          realm.delete(deletingRecurrence);
          resolve();
        });
      })
      .catch((error) => reject(error));
    }) */