import {GroupDB} from "db_vasern";
import {
    REFRESH_GROUP_LIST
} from "../types";
//interfaces
import {GroupI} from "res";

export const refreshGroupList = () => {
    let allGroups = GroupDB.data() as GroupI[];
    return {
        type: REFRESH_GROUP_LIST,
        payload: allGroups
    }
}