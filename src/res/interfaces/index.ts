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
  daily: boolean;
  groups: GroupI[];
  date: Date
}

export interface GroupI{
  id: string,
  name: string,
  notes: string
}
