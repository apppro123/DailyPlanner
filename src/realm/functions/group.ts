/* import Realm from 'realm';
import {GROUP} from '../Schemas';
import {schemas} from '../dbOptions';
//function to get array from realm object
import {realmObjectToArray} from './toDo';
//interfaces
import {GroupI} from 'res';
//latest schema
const latestSchema = schemas[schemas.length - 1];

export const getAllGroups = () =>
  new Promise<GroupI[]>((resolve, reject) => {
    Realm.open(latestSchema)
      .then((realm) => {
        const rawAllGroups = realm.objects<GroupI>(GROUP);
        resolve(realmObjectToArray(rawAllGroups));
      })
      .catch((error) => reject(error));
  });

export const getAllGroupIds = () => 
  new Promise<string[]>((resolve, reject) => {
    Realm.open(latestSchema)
      .then((realm) => {
        const allGroupIds = realm.objects<GroupI>(GROUP).map((group: GroupI) => group.id);
        resolve(allGroupIds);
      })
      .catch((error) => reject(error));
  });

export const deleteGroup = (id: string) =>
  new Promise<GroupI[]>((resolve, reject) => {
    Realm.open(latestSchema)
      .then((realm) => {
        realm.write(() => {
          let deletingGroup = realm.objectForPrimaryKey(GROUP, id);
          realm.delete(deletingGroup);
          const rawAllGroups = realm.objects<GroupI>(GROUP);
          resolve(realmObjectToArray(rawAllGroups));
        });
      })
      .catch((error) => reject(error));
  });

export const getGroupById = (id: string) =>
  new Promise<GroupI>((resolve, reject) => {
    Realm.open(latestSchema)
      .then((realm) => {
        const allGroups = realm.objects<GroupI>(GROUP);
        const group = allGroups.filtered('id == $0', id)[0];
        resolve(group);
      })
      .catch((error) => reject(error));
  });

export const insertNewGroup = (newGroup: GroupI) =>
  new Promise<GroupI[]>((resolve, reject) => {
    Realm.open(latestSchema)
      .then((realm) => {
        realm.write(() => {
          realm.create(GROUP, newGroup);
          //get and return all groups
          const allGroups = realm.objects<GroupI>(GROUP);
          resolve(realmObjectToArray(allGroups));
        });
      })
      .catch((error) => reject(error));
  });

export const updateGroup = (newGroup: GroupI) =>
  new Promise<GroupI[]>((resolve, reject) => {
    Realm.open(latestSchema)
      .then((realm) => {
        realm.write(() => {
          const {name, notes, id} = newGroup;
          let updatingGroup = realm.objectForPrimaryKey(GROUP, id) as GroupI;
          updatingGroup.name = name;
          updatingGroup.notes = notes;
          //get and return all groups
          const allGroups = realm.objects<GroupI>(GROUP);
          resolve(realmObjectToArray(allGroups));
        });
      })
      .catch((error) => reject(error));
  });
 */