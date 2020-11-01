import React from 'react';
import Moment from "moment";
//own components
import { OwnView, OverviewSectionList, ToDoItem } from 'components';
//navigation
import { CompositeNavigationProp } from "@react-navigation/native";
import { MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BottomTabNTypes, ToDosOverviewMaterialTopTabNTypes } from "../types";
//redux
import { connect } from 'react-redux';
import { refreshPastList, refreshTodayList } from '../../redux/actions';
//db
//import {updateOnlyDone, deleteToDo, updateOnlyDateTime} from 'db_realm';
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
  refreshTodayList, refreshPastList
}
type PropsFromRedux = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

//navigation props
type YesterdayOverviewNavigationProps = CompositeNavigationProp<MaterialTopTabNavigationProp<ToDosOverviewMaterialTopTabNTypes, "Future">,
  BottomTabNavigationProp<BottomTabNTypes>>;

interface PropsI extends PropsFromRedux {
  navigation: YesterdayOverviewNavigationProps,
}

class YesterdayOverview extends React.Component<PropsI> {
  renderYesterdayToDo = ({ item, index }: { item: ToDoI, index: number }) => {
    return (
      <ToDoItem<YesterdayOverviewNavigationProps>
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
    //update in db_vasern
    ToDoDB.update(id, { done: newDone });
    //update in redux => list
    this.props.refreshPastList()
  };

  deleteToDo = async (id: string) => {
    //delete in db
    ToDoDB.remove(id);
    //delete in redux => list
    this.props.refreshPastList()
  };

  postponeItem = async (item: ToDoI) => {
    const { refreshPastList, refreshTodayList } = this.props;
    const { dateTime, id } = item;
    const newDateTime = Moment(dateTime).add(1, "days").toDate();
    //change in db
    ToDoDB.update(id, { dateTime: newDateTime });
    //change in redux => lists
    refreshPastList();
    refreshTodayList();
  };

  render() {
    const { refreshPastList, pastToDos } = this.props.ToDos;
    return (
      <OwnView style={globalStyles.screenContainer}>
        <OverviewSectionList
          sections={pastToDos}
          renderItem={this.renderYesterdayToDo}
          extraData={refreshPastList}
        />
      </OwnView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(YesterdayOverview);
