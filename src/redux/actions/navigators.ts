import { CHANGE_NAVIGATORS_STATE } from "../types";

export const changeNavigatorsState = (newState: any): any => {
    return {
        type: CHANGE_NAVIGATORS_STATE,
        payload: newState
    }
}