import React from 'react';
import Moment from "moment";
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
import {updateOnlyDone, deleteToDo, updateOnlyDateTime} from 'db_realm';
//interfaces and types
import { ToDoI } from "res";
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
  renderYesterdayToDo = ({item, index}: { item: ToDoI, index: number }) => {
    return (
      <ToDoItem<YesterdayOverviewNavigationProps>
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
    await updateOnlyDone(newDone, id);
    //update redux
    let {pastToDos} = ToDos;
    let item = pastToDos[index];
    item.done = newDone;
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
    const { dateTime, id } = item;
    const newDateTime = Moment(dateTime).add("days", 1).toDate();
    //change in db
    updateOnlyDateTime(id, newDateTime)
    //change in redux
    const {pastToDos, todayToDos} = this.props.ToDos;
    //delete from todays list
    pastToDos.splice(indexInList, 1);
    this.props.refreshPastList();
    //add to future list with new date
    item.dateTime = newDateTime;
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

export default connect(mapStateToProps, mapDispatchToProps)(YesterdayOverview);
