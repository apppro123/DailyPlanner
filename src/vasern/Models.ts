export const TODO = 'ToDo';
//export const DAYS_DONE = 'DAYS_DONE';
export const GROUP = "Group";
export const RECURRENCE = "Recurrence";
//export const REMINDER = "REMINDER";

export const ToDoModel = {
    name: TODO,
    props: {
        name: "string",
        notes: "string",
        done: "boolean",
        groups: "[]#GROUP",
        dateTime: "?datetime",
        recurrence: "?#RECURRENCE"
        //add reminde/alarm
    }
}

export const GroupModel = {
    name: GROUP,
    props: {
        name: "string",
        notes: "string"
    }
}

export const RecurrenceModel = {
    name: RECURRENCE,
    props: {
        recurrenceRule: "string"
    }
}