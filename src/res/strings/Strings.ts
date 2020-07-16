import LocalizedStrings from 'react-native-localization';

export const Strings = new LocalizedStrings({
  en: {
    //normal
    SEARCH: 'search',
    ERROR_OCCURED: 'Sorry, but an error occured!',
    PERMISSION_NOT_GRANTED:
      "Without granting the permission we won't be able to provide this feature.",
    ADD: 'add',
    BACK: 'back',
    CANCEL: 'cancel',
    CONFIRM: 'confirm',
    DELETE: 'delete',
    CHANGE: 'change',
    CREATE: 'create',
    AND: 'and',

    //todos
    NAME: 'name',
    NOTES: 'notes',
    NEW_TODO: 'new to-do',
    CHANGE_TODO: 'change to-do',

    //to delete
    DELETE_TODO: 'delete to-do',
    WANT_DELETE_TODO: 'Do you want to delete this to-do?',

    //daily
    DAILY: 'daily',
  },
  de: {
    //normal
    SEARCH: 'suchen',
    ERROR_OCCURED: 'Entschuldigung, ein Fehler ist aufgetreten.',
    PERMISSION_NOT_GRANTED:
      'Ohne diese Funktion zu erlauben, können wir Ihnen dieses Feature nicht zur Verfügung stellen.',
    ADD: 'hinzufügen',
    BACK: 'Zurück',
    CANCEL: 'Abbrechen',
    CONFIRM: 'Bestätigen',
    DELETE: 'Löschen',
    CHANGE: 'Verändern',
    CREATE: 'Erstellen',
    AND: 'und',

    //todos
    NAME: 'Name',
    NOTES: 'Notizen',
    NEW_TODO: 'Neues To-do',
    CHANGE_TODO: 'To-do verändern',

    //to delete
    DELETE_TODO: 'To-do löschen',
    WANT_DELETE_TODO: 'Wollen Sie dieses To-do löschen?',

    //daily
    DAILY: 'täglich',
  },
});
