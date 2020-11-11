import { REFRESH_GROUP_LIST} from "../types";
//interfaces
import {GroupI} from "res";

export interface SettingsReduxStateI {
    allGroups: GroupI[],
    refreshGroupOverview: boolean
}

const initialState: SettingsReduxStateI = {
    allGroups: [],
    //just a boolean which changes when list should refresh
    refreshGroupOverview: false
}

export default (state = initialState, action: {payload: any, type: string}) => {
    const {payload, type} = action;
    switch (type) {
        case REFRESH_GROUP_LIST:
            return {...state, refreshGroupOverview: !state.refreshGroupOverview, allGroups: payload};
        default: 
            return: state;
    }
}