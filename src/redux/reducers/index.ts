import { combineReducers } from "redux";
//export redux state interfaces
export * from "./toDos";

import NavigatorsReducer from "./navigators";
import ToDosReducer from "./toDos";

export const rootReducer = combineReducers({
    navigators: NavigatorsReducer,
    toDos: ToDosReducer
});

export type RootStateType = ReturnType<typeof rootReducer>;