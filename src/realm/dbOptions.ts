//import realm
import Realm from 'realm';
//import schemas
import {ToDoSchema, TODO, GroupSchema} from './Schemas';
//moment
import Moment from "moment";
//intefaces
import {ToDoI} from "res";

//all schemas
const DBschemas = [ToDoSchema, GroupSchema]

//db options
export const schemas = [
  {schema: DBschemas, schemaVersion: 2, migration: migrateFunction01}
]
const latestSchema = schemas[schemas.length-1]

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
function migrateFunction01(oldRealm: Realm, newRealm: Realm){
  if(oldRealm.schemaVersion < 0.1){
    //still with daysDone
    const oldObjects = oldRealm.objects<ToDoI>(TODO);
    //no daysDone anymore
    const newObjects = newRealm.objects<ToDoI>(TODO);

    for(let i=0; i<oldObjects.length; i++){
      let newToDo = newObjects[i];
      let oldToDo = oldObjects[i];
      //add groups to new to-do
      newToDo.groups = [];
      //set new date and change daysDone to done
      if(!oldToDo.daily){
        //if it is not daily
        //add date
        switch(oldToDo.daysDone[0].dayIndex){
          //switch yesterday, today and tomorrow
          case 0:
            newToDo.date = Moment().subtract(1, "days").toDate();
          case 1:
            newToDo.date = Moment().toDate();
          case 2: 
            newToDo.date = Moment().add(1, "days").toDate();
          default:
            newToDo.date = Moment().toDate();
        }
        //change daysDone to done
        newToDo.done = oldToDo.daysDone[0].done;
      }else{
        //if it is daily just change daysDone to done
        //assign done of today
        newToDo.done = oldToDo.daysDone[1].done;
      }
    }
  }
}