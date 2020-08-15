import LocalizedStrings from 'react-native-localization';

export const ToDoStrings = new LocalizedStrings({
    en: {
        DAILY_TODOS: "daily to-dos",
        CHOOSE_DAYS_KEEP_TODO: "Choose the days on which you want to keep this to-do.",
        //change/add to-dos
        PICK_DATE: 'pick a date',
        PICK_TIME: 'pick a time',
        PLS_SELECT_TIME_AFTER_NOW: 'Please select a time in the future.',
    },
    de: {
        DAILY_TODOS: "Tägliche To-dos",
        CHOOSE_DAYS_KEEP_TODO: "Wähle die Tage aus, an denen Sie das To-do behalten wollen.",
        //change/add to-dos
        PICK_DATE: 'Wähle ein Datum',
        PICK_TIME: 'Wähle eine Zeit',
        PLS_SELECT_TIME_AFTER_NOW: 'Bitte wählen Sie eine Zeit in der Zukunft.',
    } 
})