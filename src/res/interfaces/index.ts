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
  groupIds: string[];
  dateTime: Date,
  recurrenceId?: string
}

export interface GroupI{
  id: string,
  name: string,
  notes: string
}

export interface RecurrenceI {
  id: string,
  recurrenceRule: "daily"   //late i can add more like "weekly", ...
}