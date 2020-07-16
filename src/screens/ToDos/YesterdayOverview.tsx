import React from 'react';
//own components
import {OwnView, OverviewList, ToDoItem} from 'components';
//navigation
import { CompositeNavigationProp } from "@react-navigation/native";
import { MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BottomTabNTypes, ToDosOverviewMaterialTopTabNTypes } from "../types";
//redux
import {connect} from 'react-redux';
import {refreshPastList, refreshTodayList} from '../../redux/actions';
//db
import {updateOnlyDone, deleteToDo, updateOnlyDayIndex} from 'db_realm';
//interfaces and types
import { DaysDoneI, ToDoI } from "res";
import { RootStateType } from 'src/redux/reducers';
//styles
import {globalStyles} from '../style';

//typescript for redux
const mapStateToProps = (state: RootStateType) => {
  return {
    ToDos: state.toDos,
  };
};
const mapDispatchToProps = {
  refreshTodayList, refreshPastList
}
type PropsFromRedux = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

//navigation props
type YesterdayOverviewNavigationProps = CompositeNavigationProp<MaterialTopTabNavigationProp<ToDosOverviewMaterialTopTabNTypes, "Tomorrow">,
  BottomTabNavigationProp<BottomTabNTypes>>;

interface PropsI extends PropsFromRedux{
  navigation: YesterdayOverviewNavigationProps,
}

class YesterdayOverview extends React.Component<PropsI> {
  renderYesterdayToDo = ({item, index}) => {
    let checked = false;
    const daysDone = item.daysDone as DaysDoneI[]
    if (daysDone.length > 1) {
      let indexOfToday = daysDone.findIndex(
        dayDone => dayDone.dayIndex === 0,
      );
      checked = daysDone[indexOfToday].done;
    } else if(daysDone.length === 1){
      checked = daysDone[0].done;
    }
    return (
      <ToDoItem<YesterdayOverviewNavigationProps>
        checked={checked}
        item={item}
        index={index} //index of item in the array
        onCheckSwitch={this.onCheckSwitch}
        deleteToDo={this.deleteToDo}
        postponeItem={this.postponeItem}
        navigation={this.props.navigation}
      />
    );
  };

  //methods for list
  onCheckSwitch = async (newDone: boolean, id: string, index: number /*index of item in the list*/) => {
    const {refreshPastList, ToDos} = this.props;
    //update realm
    await updateOnlyDone(newDone, id, 0);
    //update redux
    let {pastToDos} = ToDos;
    let item = pastToDos[index];
    //get array
    const daysDone = item.daysDone as DaysDoneI[];
    if (daysDone.length > 1) {
      //daily
      let indexOfToday = daysDone.findIndex(
        dayDone => dayDone.dayIndex === 0,
      );
      daysDone[indexOfToday].done = newDone;
    } else {
      //just on specific day
      daysDone[0].done = newDone;
    }
    refreshPastList();
  };

  deleteToDo = async (id: string, indexInList: number) => {
    //delete in db
    await deleteToDo(id);
    //delete in redux
    const {pastToDos} = this.props.ToDos;
    pastToDos.splice(indexInList, 1);
    this.props.refreshPastList();
  };

  postponeItem = async (indexInList: number, item: ToDoI) => {
    //change in db
    updateOnlyDayIndex(item.id, 1)
    //change in redux
    const {pastToDos, todayToDos} = this.props.ToDos;
    //delete from todays list
    pastToDos.splice(indexInList, 1);
    this.props.refreshPastList();
    //change dayIndex and add to tomorrows list
    item.daysDone[0].dayIndex = 1;
    todayToDos.push(item);
    this.props.refreshTodayList();
  };

  render() {
    const {refreshPastList, pastToDos} = this.props.ToDos;
    return (
      <OwnView style={globalStyles.screenContainer}>
        <OverviewList
          data={pastToDos}
          renderItem={this.renderYesterdayToDo}
          extraData={refreshPastList}
        />
      </OwnView>
    );
  }
}

export default connect(mapStateToProps, {
  refreshPastList,
  refreshTodayList
})(YesterdayOverview);
