export const TODO = 'ToDo';
//export const DAYS_DONE = 'DAYS_DONE';
export const GROUP = "Group";
export const RECURRENCE = "Recurrence";
//export const REMINDER = "REMINDER";

export class ToDoModel {
    name=TODO;
    props = {
        id: "string",
        name: "string",
        notes: "string",
        done: "string",
        groups: "[]#GROUP",
        dateTime: "?datetime",
        recurrence: "?#RECURRENCE"
        //add reminde/alarm
    }
}

export class GroupModel {
    name=GROUP;
    props = {
        id: "string",
        name: "string",
        notes: "string"
    }
}

export class RecurrenceModel {
    name = RECURRENCE;
    props = {
        id: "string",
        recurrenceRule: "string"
    }
}