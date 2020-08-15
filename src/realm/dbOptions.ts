//uuid generator
import UUIDGenerator from 'react-native-uuid-generator';
//import realm
import Realm from 'realm';
//import schemas
import {ToDoSchema, TODO, GroupSchema, RECURRENCE} from './Schemas';
//moment
import Moment from 'moment';
//intefaces
import {ToDoI, RecurrenceI} from 'res';

//all schemas
const DBschemas = [ToDoSchema, GroupSchema];

//db options
export const schemas = [
  {schema: DBschemas, schemaVersion: 2, migration: migrateFunction01},
  {schema: DBschemas, schemaVersion: 3, migration: migrateFunction02},
  {schema: DBschemas, schemaVersion: 4, migration: migrateFunction03},
];
const latestSchema = schemas[schemas.length - 1];

// The first schemas to update to is the current schemas version
// since the first schemas in our array is at nextSchemaIndex:
let nextSchemaIndex = Realm.schemaVersion(Realm.defaultPath);

// If Realm.schemaVersion() returned -1, it means this is a new Realm file
// so no migration is needed.
if (nextSchemaIndex !== -1) {
  while (nextSchemaIndex < schemas.length) {
    const migratedRealm = new Realm(schemas[nextSchemaIndex]);
    nextSchemaIndex++;
    migratedRealm.close();
  }
}

//open realm with the latest schema
Realm.open(latestSchema);

//realm object so i can also acces db from other files
export default new Realm(latestSchema);

//migrate functions
function migrateFunction01(oldRealm: Realm, newRealm: Realm) {
  if (oldRealm.schemaVersion <= 1) {
    //still with daysDone
    const oldObjects = oldRealm.objects<ToDoI>(TODO);
    //no daysDone anymore
    const newObjects = newRealm.objects<ToDoI>(TODO);

    for (let i = 0; i < oldObjects.length; i++) {
      let newToDo = newObjects[i];
      let oldToDo = oldObjects[i];
      //add groups to new to-do
      newToDo.groups = [];
      //set new date and change daysDone to done
      if (!oldToDo.daily) {
        //if it is not daily
        //add date
        switch (oldToDo.daysDone[0].dayIndex) {
          //switch yesterday, today and tomorrow
          case 0:
            newToDo.dateTime = Moment().subtract(1, 'days').toDate();
          case 1:
            newToDo.dateTime = Moment().toDate();
          case 2:
            newToDo.dateTime = Moment().add(1, 'days').toDate();
          default:
            newToDo.dateTime = Moment().toDate();
        }
        //change daysDone to done
        newToDo.done = oldToDo.daysDone[0].done;
      } else {
        //if it is daily just change daysDone to done
        //assign done of today
        newToDo.done = oldToDo.daysDone[1].done;
      }
    }
  }
}

//change date to dateTime in ToDo
function migrateFunction02(oldRealm: Realm, newRealm: Realm) {
  if (oldRealm.schemaVersion <= 2) {
    //still with daysDone
    const oldObjects = oldRealm.objects<ToDoI>(TODO);
    //no daysDone anymore
    const newObjects = newRealm.objects<ToDoI>(TODO);
    for (let i = 0; i < oldObjects.length; i++) {
      let newToDo = newObjects[i];
      let oldToDo = oldObjects[i];
      newToDo.dateTime = oldToDo.date;
    }
  }
}

//add Recurrence 
async function migrateFunction03(oldRealm: Realm, newRealm: Realm) {
  if (oldRealm.schemaVersion <= 3) {
    //still with daysDone
    const oldObjects = oldRealm.objects<ToDoI>(TODO);
    //no daysDone anymore
    const newObjects = newRealm.objects<ToDoI>(TODO);
    for (let i = 0; i < oldObjects.length; i++) {
      let newToDo = newObjects[i];
      let oldToDo = oldObjects[i];
      if (oldToDo.daily) {
        const uuid = await UUIDGenerator.getRandomUUID();
        let newRecurrence = {id: uuid, recurrenceRule: 'daily'} as RecurrenceI;
        newToDo.recurrence = newRecurrence;
      }
    }
  }
}
