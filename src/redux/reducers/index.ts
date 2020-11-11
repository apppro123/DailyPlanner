import { combineReducers } from "redux";
//export redux state interfaces
export * from "./toDos";

import NavigatorsReducer from "./navigators";
import ToDosReducer from "./toDos";
import SettingsReducer from "./settings";

export const rootReducer = combineReducers({
    navigators: NavigatorsReducer,
    toDos: ToDosReducer,
    settings: SettingsReducer
});

export type RootStateType = ReturnType<typeof rootReducer>;