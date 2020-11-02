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
        onCheckSwitch={this.onCheckSwitch}
        deleteToDo={this.deleteToDo}
        postponeItem={this.postponeItem}
        navigation={this.props.navigation}
      />
    );
  };

  //methods for list
  onCheckSwitch = async (newDone: boolean, id: string) => {
    //update realm
    ToDoDB.update(id, { done: newDone });
    //update redux => list
    this.props.refreshTodayList()
  };

  deleteToDo = async (id: string) => {
    //delete in db
    ToDoDB.remove(id);
    //update redux => list
    this.props.refreshTodayList();
  };

  postponeItem = async (item: ToDoI) => {
    const { dateTime, id } = item;
    const newDateTime = Moment(dateTime).add(1, "days").toDate();
    //change date in db
    ToDoDB.update(id, { dateTime: newDateTime });
    //change redux => lists
    this.props.refreshFutureList();
    this.props.refreshTodayList();
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