//interfaces
import {ToDoI, GroupI} from "res";

export type BottomTabNTypes = {
    ToDosOverviewN: undefined,
    NewToDoN: undefined,
    DailyToDosN: undefined,
    ChangeToDoStackN: {screen: string, params: {toDo: ToDoI}}
    SettingsN: undefined
}

export type ToDosOverviewMaterialTopTabNTypes = {
    Past: undefined,
    Today: undefined,
    Future: undefined,
}

export type ChangeTodoStackNTypes = {
    ChangeToDo: {changeDisabled?: boolean, toDo: ToDoI}
}

export type DailyToDosOverviewStackNTypes = {
    DailyToDosOverview: {dailyToDos: boolean, previous_screen: string}
}

export type NewToDoStackNTypes = {
    NewToDo: {addDisabled: boolean}
}

export type SettingsStackNTypes = {
    SettingsOverview: undefined,
    GroupsOverview: {groups: GroupI[]} | undefined ,
    Group: {mode: "new" | "change", groupId?: string, addDisabled: boolean}
}