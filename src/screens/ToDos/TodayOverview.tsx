import React from 'react';
import Moment from "moment";
//own components
import { OwnView, OverviewList, ToDoItem } from 'components';
//navigation
import { CompositeNavigationProp } from "@react-navigation/native";
import { MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BottomTabNTypes, ToDosOverviewMaterialTopTabNTypes } from "../types";
//redux
import { connect } from 'react-redux';
import {
  refreshTodayList,
  refreshFutureList,
} from '../../redux/actions';
//db
//import { updateOnlyDone, deleteToDo, updateOnlyDateTime } from 'db_realm';
//interfaces and types
import { ToDoI } from "res";
import { RootStateType } from 'src/redux/reducers';
//styles
import { globalStyles } from '../style';
import { ToDoDB } from 'db_vasern';
import { RefreshControl } from 'react-native';

//typescript for redux
const mapStateToProps = (state: RootStateType) => {
  return {
    ToDos: state.toDos,
  };
};
const mapDispatchToProps = {
  refreshTodayList,
  refreshFutureList
}
type PropsFromRedux = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

//navigation props
type TodayOverviewNavigationProps = CompositeNavigationProp<MaterialTopTabNavigationProp<ToDosOverviewMaterialTopTabNTypes, "Today">,
  BottomTabNavigationProp<BottomTabNTypes>>;

interface PropsI extends PropsFromRedux {
  navigation: TodayOverviewNavigationProps,
}

class TodayOverview extends React.Component<PropsI> {
  renderTodayToDo = ({ item, index }: { item: ToDoI, index: number }) => {
    return (
      <ToDoItem<TodayOverviewNavigationProps>
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
    const { refreshTodayList, ToDos } = this.props;
    //update realm
    //await updateOnlyDone(newDone, id);
    ToDoDB.update(id, {done: newDone});
    //update redux
    let { todayToDos } = ToDos;
    let item = todayToDos[index] as ToDoI;
    item.done = newDone;
    refreshTodayList();
  };

  deleteToDo = async (id: string, indexInList: number) => {
    //delete in db
    ToDoDB.remove(id);
    //delete in redux
    const { todayToDos } = this.props.ToDos;
    todayToDos.splice(indexInList, 1);
    this.props.refreshTodayList();
  };

  postponeItem = async (indexInList: number, item: ToDoI) => {
    const { dateTime, id } = item;
    const newDateTime = Moment(dateTime).add(1, "days").toDate();
    //change date in db
    //updateOnlyDateTime(id, newDateTime);
    ToDoDB.update(id, {dateTime: dateTime});
    //change in redux
    const { todayToDos, futureToDos } = this.props.ToDos;
    //delete from todays list
    todayToDos.splice(indexInList, 1);
    this.props.refreshTodayList();
    //add to future list with new date
    item.dateTime = newDateTime;
    futureToDos.push(item);
    this.props.refreshFutureList();
  };

  render() {
    const { refreshTodayList, todayToDos } = this.props.ToDos;
    return (
      <OwnView style={globalStyles.screenContainer}>
        <OverviewList
          data={todayToDos}
          renderItem={this.renderTodayToDo}
          extraData={refreshTodayList}
        />
      </OwnView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TodayOverview);