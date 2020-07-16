import Realm from 'realm';
import {GROUP} from '../Schemas';
import {schemas} from '../dbOptions';
//function to get array from realm object
import {realmObjectToArray} from './toDo';
//interfaces
import {GroupI} from 'res';

export const getAllGroups = () =>
  new Promise<GroupI[]>((resolve, reject) => {
    Realm.open(schemas[schemas.length - 1])
      .then(realm => {
        const rawAllGroups = realm.objects<GroupI>(GROUP);
        resolve(realmObjectToArray(rawAllGroups));
      })
      .catch(error => reject(error));
  });
