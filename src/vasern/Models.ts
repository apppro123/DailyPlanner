export const TODO = 'ToDo';
//export const DAYS_DONE = 'DAYS_DONE';
export const GROUP = 'Group';
export const RECURRENCE = 'Recurrence';
//export const REMINDER = "REMINDER";

export const ToDoModel = {
  name: TODO,
  props: {
    name: 'string',
    notes: 'string',
    done: 'boolean',
    groups: '[]#GROUP',
    dateTime: '?datetime',
    recurrence: '?#RECURRENCE',
    //add reminder/alarm
  },
};

export const GroupModel = {
  name: GROUP,
  props: {
    name: 'string',
    notes: 'string',
  },
};

export const RecurrenceModel = {
  name: RECURRENCE,
  props: {
    recurrenceRule: 'string', //later add other recurrenceRules like "weekly" ...
    //current and best streak in days
    currentStreak: 'int',
    bestStreak: 'int',
  },
};
