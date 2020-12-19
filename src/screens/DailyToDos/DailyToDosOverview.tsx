import React from 'react';
import { StyleSheet } from 'react-native';
//own components
import {
  OwnView,
  OverviewList,
  OwnButton,
  OwnIcon,
  DeleteDailyToDoModal,
  OwnText
} from 'components';
//navigation
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BottomTabNTypes, DailyToDosOverviewStackNTypes } from "../types";
//redux
import { connect } from 'react-redux';
import { refreshDailyList } from '../../redux/actions';
//interfaces and types
import { SavedToDoI } from "res";
import { RootStateType } from 'src/redux/reducers';
//styles
import { globalStyles } from '../style';
import { ToDoDB } from 'db_vasern';

//typescript for redux
const mapStateToProps = (state: RootStateType) => {
  return {
    ToDos: state.toDos,
    Navigators: state.navigators
  };
};
const mapDispatchToProps = {
  refreshDailyList
}
type PropsFromRedux = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

//navigation props
type NewToDoNavigationProps = CompositeNavigationProp<StackNavigationProp<DailyToDosOverviewStackNTypes, "DailyToDosOverview">,
  BottomTabNavigationProp<BottomTabNTypes>>;
type NewToDoRouteProps = RouteProp<DailyToDosOverviewStackNTypes, "DailyToDosOverview">

interface PropsI extends PropsFromRedux {
  navigation: NewToDoNavigationProps,
  route: NewToDoRouteProps
}

interface StateI {
  deleteModalVisible: boolean,
  idToDelete: string
}

class DailyToDosOverview extends React.Component<PropsI, StateI> {
  unsubscribeBlurListner: any;

  state = {
    deleteModalVisible: false,
    idToDelete: '',
  };

  componentDidMount() {
    this.unsubscribeBlurListner = this.props.navigation.addListener(
      'blur',
      () => {
        this.props.navigation.setParams({ previous_screen: 'dailyToDos' });
      },
    );
  }

  componentWillUnmount() {
    this.unsubscribeBlurListner();
  }

  renderDailyToDo = ({ item, index }: { item: SavedToDoI, index: number }) => {
    const navigateToChange = () => this.props.navigation.navigate('ChangeToDoStackN', { screen: "ChangeToDo", params: { toDoId: item.id } });
    const {recurrence} = item;
    return (
      <OwnView
        style={styles.itemContainer}
        key={index.toString()}>
        <OwnButton
          textStyle={styles.itemText}
          text={item.name}
          onPress={navigateToChange}
        />
        <OwnButton
          onPress={() => this.askDeleteToDo(item.id)}
          style={globalStyles.deleteButton}>
          <OwnIcon iconSet="MaterialCommunity" name="trash-can" size={35} />
        </OwnButton>
        {/* show current streak of this To-do */}
        <OwnText text={recurrence ? recurrence.currentStreak.toString() : "0"}/>
      </OwnView>
    );
  };

  //delete methods
  askDeleteToDo = (id: string) => {
    this.setState({ idToDelete: id, deleteModalVisible: true });
  };

  //methods for modal
  onDeleteCancel = () => this.setState({ deleteModalVisible: false });

  onDeleteDailyToDo = async () => {
    const idToDelete = this.state.idToDelete;
    //delete daily to-do
    await ToDoDB.asyncRemove(idToDelete);
    this.props.refreshDailyList();
    this.setState({ deleteModalVisible: false });

  };

  render() {
    const { refreshDailyList, dailyToDos } = this.props.ToDos;
    return (
      <OwnView style={globalStyles.screenContainer}>
        <OverviewList
          data={dailyToDos}
          renderItem={this.renderDailyToDo}
          extraData={refreshDailyList}
        />
        <DeleteDailyToDoModal
          visible={this.state.deleteModalVisible}
          onCancel={this.onDeleteCancel}
          onDeleteDailyToDo={this.onDeleteDailyToDo}
        />
      </OwnView>
    );
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  itemText: {
    fontSize: 30,
  },
});

export default connect(mapStateToProps, { refreshDailyList })(DailyToDosOverview);
