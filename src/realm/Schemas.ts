export const TODO = 'to-do';
//export const DAYS_DONE = 'DAYS_DONE';
export const GROUP = "group";
//export const REMINDER = "REMINDER";


export const ToDoSchema = {
  name: TODO,
  primaryKey: 'id',
  properties: {
    id: {type: 'string', indexed: true},
    name: {type: 'string', indexed: true},
    notes: {type: 'string'},
    done: {type: "bool"},
    daily: {type: 'bool'},
    groups: {objectType: GROUP, type: "list"},   //i don't know how to express it as an object
    date: {type: "date", optional: true, indexed: true}
    //could add a reminder/alarm
    //could add recurrence => more options than just daily
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
