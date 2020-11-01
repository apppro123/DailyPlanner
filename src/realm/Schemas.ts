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
    groupIds: {type: "string[]"},  
    dateTime: {type: "date", optional: true, indexed: true},
    recurrenceId: {type: "string", optional: true}
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

/* export const ReminderSchema = {
  name: REMINDER,
  properties: {
    reminderId: {type: "string"}
  }
} */
