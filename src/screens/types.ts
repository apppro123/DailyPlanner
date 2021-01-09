//interfaces
import {GroupI} from "res";

export type BottomTabNTypes = {
    ToDosOverviewN: undefined,
    NewToDoN: undefined,
    DailyToDosN: undefined,
    ChangeToDoStackN: {screen: string, params: {toDoId: string}}
    SettingsN: undefined
}

export type ToDosOverviewMaterialTopTabNTypes = {
    Past: undefined,
    Today: undefined,
    Future: undefined,
}

export type ChangeTodoStackNTypes = {
    ChangeToDo: {changeDisabled?: boolean, toDoId: string}
}

export type DailyToDosOverviewStackNTypes = {
    DailyToDosOverview: {dailyToDos: boolean, previous_screen: string}
}

export type NewToDoStackNTypes = {
    NewToDo: {addDisabled: boolean}
}

export type SettingsStackNTypes = {
    SettingsOverview: undefined,
    GroupsOverview: undefined ,
    Group: {mode: "new" | "change", groupId?: string, addDisabled: boolean}
}