import React from "react";
import {StyleSheet} from "react-native";
//own components
import {OwnView} from "../basicC"
//redux
import { connect } from 'react-redux';
import {
    refreshDailyList
} from '../../redux/actions';
import { RootStateType } from 'src/redux/reducers';

//db
import { RecurrenceDB, ToDoDB } from "db_vasern";
//own
import { OwnExpandableList } from "../basicC";
import { ToDoItem } from "./ToDoItem";
import { ToDoI } from "res";

//typescript from redux
const mapStateToProps = (state: RootStateType) => {
    return {
     };
};
const mapDispatchToProps = {
    refreshDailyList
}
type PropsFromRedux = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

interface PropsI<NavigationType> extends PropsFromRedux {
    data: ToDoI[],
    extraData?: any,
    navigation: NavigationType
}


class ExpandableDailyToDosList<NavigationType> extends React.Component<PropsI<NavigationType>> {
    renderItem = ({ item, index }) => {
        return (
            <ToDoItem
                item={item}
                onCheckSwitch={this.onCheckSwitch}
                deleteToDo={this.deleteToDo}
                navigation={this.props.navigation} />
        )
    }

    //methods for list
    onCheckSwitch = async (newDone: boolean, id: string, recurrenceId: string) => {
        //update realm
        await ToDoDB.update(id, { done: newDone });
        const recurrence = RecurrenceDB.get(recurrenceId);
        await RecurrenceDB.update(recurrenceId, {currentStreak: recurrence.currentStreak+(newDone ? 1 : -1)})
        //update redux => list
        this.props.refreshDailyList()
    };

    //doesn't refresh respectively needs time to remove event in db but await doesn't work
    //and I'm not sure if calling .onRemove and then refreshing is the "best" idea...
    deleteToDo = async (id: string) => {
        //delete in db
        await ToDoDB.remove(id);
        //update redux => list
        this.props.refreshDailyList();
    };

    render() {
        const { data, extraData } = this.props;
        return (
            <OwnView style={styles.container}>
            <OwnExpandableList<ToDoI> extraData={extraData} maxHeight={400
            } title={"DailyToDos"} renderItem={this.renderItem} data={data} />
            </OwnView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 5,
        borderBottomWidth: 2,
        borderColor: "black",
        paddingBottom: 5
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(ExpandableDailyToDosList);