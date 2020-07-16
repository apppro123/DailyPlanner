import { CHANGE_NAVIGATORS_STATE} from "../types";

const initialState = {
    state: {}
}

export default (state = initialState, action) => {
    const { payload, type } = action;
    switch(type){
        case CHANGE_NAVIGATORS_STATE: 
            return {...state, state: payload};
        default:
            return state;
    }
}