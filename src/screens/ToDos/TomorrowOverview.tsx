import React from 'react';
import Moment from "moment";
//own components
import { OwnView, ToDoItem, OverviewSectionList } from 'components';
//navigation
import { CompositeNavigationProp } from "@react-navigation/native";
import { MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BottomTabNTypes, ToDosOverviewMaterialTopTabNTypes } from "../types";
//redux
import { connect } from 'react-redux';
import {
  refreshFutureList,
} from '../../redux/actions';
//db
//import {updateOnlyDone, deleteToDo} from 'db_realm';
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
  refreshFutureList
}
type PropsFromRedux = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

//navigation props
type TomorrowOverviewNavigationProps = CompositeNavigationProp<MaterialTopTabNavigationProp<ToDosOverviewMaterialTopTabNTypes, "Tomorrow">,
  BottomTabNavigationProp<BottomTabNTypes>>;

interface PropsI extends PropsFromRedux {
  navigation: TomorrowOverviewNavigationProps,
}



class TomorrowOverview extends React.Component<PropsI> {
  renderTomorrowToDo = ({ item, index }: { item: ToDoI, index: number }) => {
    return (
      <ToDoItem<TomorrowOverviewNavigationProps>
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
    //update vasern
    ToDoDB.update(id, { done: newDone });
    //update redux => lists
    this.props.refreshFutureList();
  };

  deleteToDo = async (id: string) => {
    //delete in db
    ToDoDB.remove(id);
    //delete in redux => list
    this.props.refreshFutureList()
  };

  postponeItem = async (item: ToDoI) => {
    const { refreshFutureList } = this.props;
    const { dateTime, id } = item;
    const newDateTime = Moment(dateTime).add(1, "days").toDate();
    //change in db
    ToDoDB.update(id, { dateTime: newDateTime });
    //change in redux => lists
    refreshFutureList();
  };

  render() {
    const { refreshFutureList, futureToDos } = this.props.ToDos;
    return (
      <OwnView style={globalStyles.screenContainer}>
        <OverviewSectionList
          sections={futureToDos}
          renderItem={this.renderTomorrowToDo}
          extraData={refreshFutureList}
        />
      </OwnView>
    );
  }
}


export default connect(mapStateToProps, {
  refreshFutureList,
})(TomorrowOverview);
