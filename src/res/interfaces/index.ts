//theme
export interface ThemeI {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    falseInput?: string;
  };
}

export interface ToDoI {
  id: string;
  name: string;
  notes: string;
  done: boolean;
  groups: GroupI[];
  dateTime?: Date,
  recurrence?: RecurrenceI
}

//after saving to vasern, it changes ojbects to ids of objects
export interface SavedToDoI {
  id: string;
  name: string;
  notes: string;
  done: boolean;
  groups_id: string[];
  dateTime: Date;
  recurrence_id: string
}

export interface GroupI{
  id: string,
  name: string,
  notes: string
}

export interface RecurrenceI {
  //no id becaue it will be generate after inserting in db
  recurrenceRule: "daily"   //late i can add more like "weekly", ...
  currentStreak: number,
  bestStreak: number
}