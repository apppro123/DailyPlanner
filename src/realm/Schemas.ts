export const TODO = 'to-do';
//export const DAYS_DONE = 'DAYS_DONE';
export const GROUP = "group";
export const RECURRENCE = "recurrence";
//export const REMINDER = "REMINDER";


export const ToDoSchema = {
  name: TODO,
  primaryKey: 'id',
  properties: {
    id: {type: 'string', indexed: true},
    name: {type: 'string', indexed: true},
    notes: {type: 'string'},
    done: {type: "bool"},
    groups: {objectType: GROUP, type: "list"},   //i don't know how to express it as an object
    dateTime: {type: "date", optional: true, indexed: true},
    recurrence: {objectType: RECURRENCE, optional: true}
    //could add a reminder/alarm
  },
};

export const GroupSchema = {
  name: GROUP,
  primaryKey: "id",
  properties: {
    id: {type: "string", indexed: true},
    name: {type: "string", indexed: true},
    notes: {type: "string"},
    //could add a color or default values for reminder/daily/...
  }
}

export const RecurrenceSchema = {
  name: RECURRENCE,
  primaryKey: "id",
  properties: {
    id: {type: "string", indexed: true},
    recurrenceRule: {type: "string"}
  }
}

/* export const DaysDoneSchema = {
  name: DAYS_DONE,
  properties: {
    dayIndex: {type: 'int'}, //0 for yesterday, 1 for today, and 2 for tomorrow
    done: {type: 'bool'}, 
    //reminder: {objectType: ""}
  },
}; */

/* export const ReminderSchema = {
  name: REMINDER,
  properties: {
    reminderId: {type: "string"}
  }
} */
