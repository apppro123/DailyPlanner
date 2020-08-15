import React from 'react';
//own components
import {OwnView, OverviewList, ToDoItem} from 'components';
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
import {updateOnlyDone, deleteToDo} from 'db_realm';
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
  refreshFutureList
}
type PropsFromRedux = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

//navigation props
type TomorrowOverviewNavigationProps = CompositeNavigationProp<MaterialTopTabNavigationProp<ToDosOverviewMaterialTopTabNTypes, "Tomorrow">,
  BottomTabNavigationProp<BottomTabNTypes>>;

interface PropsI extends PropsFromRedux{
  navigation: TomorrowOverviewNavigationProps,
}



class TomorrowOverview extends React.Component<PropsI> {
  renderTomorrowToDo = ({item, index}: { item: ToDoI, index: number }) => {
    return (
      <ToDoItem<TomorrowOverviewNavigationProps>
        item={item}
        index={index} //index of item in the array
        onCheckSwitch={this.onCheckSwitch}
        deleteToDo={this.deleteToDo}
        navigation={this.props.navigation}
      />
    );
  };

  //methods for list
  onCheckSwitch = async (newDone: boolean, id: string, index: number /*index of item in the list*/) => {
    const {refreshFutureList, ToDos} = this.props;
    //update realm
    await updateOnlyDone(newDone, id);
    //update redux
    let {futureToDos} = ToDos;
    let item = futureToDos[index];
    item.done = newDone;
    refreshFutureList();
  };

  deleteToDo = async (id: string, indexInList: number) => {
    //delete in db
    await deleteToDo(id);
    //delete in redux
    const {futureToDos} = this.props.ToDos;
    futureToDos.splice(indexInList, 1);
    this.props.refreshFutureList();
  };

  render() {
    const {refreshFutureList, futureToDos} = this.props.ToDos;
    return (
      <OwnView style={globalStyles.screenContainer}>
        <OverviewList
          data={futureToDos}
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
