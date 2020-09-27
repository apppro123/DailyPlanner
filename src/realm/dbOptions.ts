//import realm
import Realm from 'realm';
//import schemas
import {ToDoSchema, GroupSchema, RecurrenceSchema} from './Schemas';

//all schemas
const DBschemas = [ToDoSchema, GroupSchema, RecurrenceSchema];

//db options
export const schemas: Realm.Configuration[] = [
  {schema: DBschemas, schemaVersion: 1}
];
const latestSchema = schemas[schemas.length - 1];

// The first schemas to update to is the current schemas version
// since the first schemas in our array is at nextSchemaIndex:
let nextSchemaIndex = Realm.schemaVersion(Realm.defaultPath);

// If Realm.schemaVersion() returned -1, it means this is a new Realm file
// so no migration is needed.
if (nextSchemaIndex !== -1) {
  while (nextSchemaIndex < schemas.length) {
    const migratedRealm = new Realm(schemas[nextSchemaIndex++]);
    migratedRealm.close();
  }
}

//realm object so i can also acces db from other files
export default new Realm(latestSchema);