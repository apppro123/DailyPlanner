import React from 'react';
import { StyleSheet, Modal, ScrollView } from 'react-native';
import Moment from "moment";
//db
import { insertNewToDo, getAllGroups } from 'db_realm';
//uuid generator
import UUIDGenerator from 'react-native-uuid-generator';
//redux
import { connect } from 'react-redux';
import { refreshDailyList, refreshPastList, refreshTodayList, refreshFutureList } from "../../redux/actions";
//own components
import {
  OwnView,
  OwnTextInput,
  OwnText,
  OwnButton,
  OwnSwitch,
  OwnIcon,
  TimeDatePicker,
  SectionIconHeader
} from 'components';
//navigation
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BottomTabNTypes, NewToDoStackNTypes } from "../types";
//strings, interfaces, types
import { Strings, GroupI, SettingStrings, ToDoStrings, ToDoI } from 'res';
const { NAME, NOTES, ADD, DAILY } = Strings;
const { GROUPS } = SettingStrings;
const { PLS_SELECT_TIME_AFTER_NOW } = ToDoStrings;
import { RootStateType } from 'src/redux/reducers';
//styles
import { globalStyles } from '../style';

//typescript for redux
const mapStateToProps = (state: RootStateType) => {
  return {
    ToDos: state.toDos,
    Navigators: state.navigators
  };
};
const mapDispatchToProps = {
  refreshTodayList,
  refreshFutureList,
  refreshPastList,
  refreshDailyList
}
type PropsFromRedux = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

//navigation props
type NewToDoNavigationProps = CompositeNavigationProp<StackNavigationProp<NewToDoStackNTypes, "NewToDo">,
  BottomTabNavigationProp<BottomTabNTypes>>;
type NewToDoRouteProps = RouteProp<NewToDoStackNTypes, "NewToDo">

interface PropsI extends PropsFromRedux {
  navigation: NewToDoNavigationProps,
  route: NewToDoRouteProps
}

interface StateI {
  name: string,
  notes: string,
  daily: boolean,
  dateTime: Moment.Moment,
  allRemainingGroups: GroupI[],
  groups: GroupI[],
  //date time picker
  datePickerVisible: boolean,
  timePickerVisible: boolean,
  //modal for picking from remaining groups
  groupsModalVisible: boolean
}

//real screen
class NewToDo extends React.Component<PropsI, StateI> {
  unsubscribeFocus: any
  unsubscribeBlur: any

  state = {
    name: '',
    notes: '',
    daily: false,
    dateTime: Moment(),
    allRemainingGroups: [] as GroupI[],
    groups: [] as GroupI[],
    datePickerVisible: false,
    timePickerVisible: false,
    groupsModalVisible: false
  };

  async componentDidMount() {
    this.props.navigation.setParams({ addDisabled: true });
    this.props.navigation.setOptions({
      headerRight: () => (
        <OwnButton
          onPress={this.addToDo}
          disabled={this.props.route.params?.addDisabled}
          text={ADD}
        />
      ),
    });
    //test where the navigator is/was
    const { routes, history } = this.props.Navigators.state;
    let daily = false;
    //in the beginning state didn't get changed yet so object is empty
    if (history && routes) {
      daily = this.checkDaily(history);
    }
    //get information from navigatorState: daily 
    //get navigator name before NewToDo to check if toDo should be daily by default
    this.setState({
      daily,
    });
    //add onFocusListener to refresh day state, and allRemainingGroups
    //because constructor/componentDidMount doesn't get called anymore
    this.unsubscribeFocus = this.props.navigation.addListener(
      "focus",
      this.refreshChangedState,
    );
    this.unsubscribeBlur = this.props.navigation.addListener(
      "blur",
      this.resetState
    );

    //set all groups
    let allRemainingGroups = await getAllGroups();
    this.setState({
      daily,
      allRemainingGroups
    })
  }

  componentWillUnmount() {
    this.unsubscribeFocus();
    this.unsubscribeBlur();
  }

  resetState = () => {
    this.setState({
      name: "",
      notes: "",
      dateTime: Moment(),
      groups: []
    })
  }

  refreshChangedState = async () => {
    this.props.navigation.setParams({ addDisabled: true });
    //test where the navigator is/was
    const { routes, history } = this.props.Navigators.state;
    let daily = false;
    //in the beginning state didn't get changed yet so object is empty
    if (history && routes) {
      daily = this.checkDaily(history);
    }
    //get all groups
    let allRemainingGroups = await getAllGroups();

    this.setState({
      daily: daily,
      allRemainingGroups: allRemainingGroups
    });
  };

  checkDaily = history => {
    let daily = false;
    if (history.length > 1) {
      //if history is longer then one (at least two screens were called before)
      let lastNavigatorKey = history[history.length - 1].key;
      let lastNavigatorName = lastNavigatorKey.substr(
        0,
        lastNavigatorKey.indexOf('-'),
      );
      if (lastNavigatorName === 'NewToDoStackN') {
        //if last one is NewTodo i need the one before
        let secondLastNavigatorKey = history[history.length - 2].key;
        let secondLastNavigatorName = secondLastNavigatorKey.substr(
          0,
          secondLastNavigatorKey.indexOf('-'),
        );
        if (secondLastNavigatorName === 'DailyToDosN') {
          daily = true;
        }
      } else {
        if (lastNavigatorName === 'DailyToDosN') {
          daily = true;
        }
      }
    }
    return daily;
  };

  //add new to do
  addToDo = async () => {
    const { name, notes, daily, dateTime, groups } = this.state;
    const toDoUuid = await UUIDGenerator.getRandomUUID();
    let newToDo: ToDoI = {
      id: toDoUuid,
      name: name.trim(),
      notes: notes.trim(),
      groups: groups,
      dateTime: dateTime.toDate(),
      done: false,
    };
    if (daily) {
      const recurrenceUuid = await UUIDGenerator.getRandomUUID();
      newToDo.recurrence = { id: recurrenceUuid, recurrenceRule: "daily" };
    }
    await insertNewToDo(newToDo);

    if (daily) {
      //refresh today, all-day and future list

    }
    //inset into redux state
    const { refreshPastList, refreshTodayList, refreshFutureList, refreshDailyList, ToDos } = this.props;
    const { dailyToDos, pastToDos, todayToDos, futureToDos } = ToDos;
    if (daily) {
      //add to-do to daily and today to-dos
      futureToDos.push(newToDo);
      dailyToDos.push(newToDo);
      todayToDos.push(newToDo);
      //refresh lists
      refreshTodayList();
      refreshFutureList();
      refreshDailyList();
    } else if (dateTime.isBefore(Moment().startOf("day"))) {
      //past to-dos
      pastToDos.push(newToDo);
      refreshPastList()
    } else if (dateTime.isAfter(Moment().endOf("day"))) {
      //future to-dos
      futureToDos.push(newToDo);
      refreshFutureList();
    } else {
      //today to-dos
      todayToDos.push(newToDo);
      refreshTodayList();
    }
    this.props.navigation.goBack();
  };

  //change inputs
  changeName = (name: string) => {
    if (name.trim() == '') {
      this.props.navigation.setParams({ addDisabled: true });
    } else if (this.state.name.trim() == '') {
      this.props.navigation.setParams({ addDisabled: false });
    }
    this.setState({ name });
  };
  changeNotes = (notes: string) => this.setState({ notes });

  //switch daily
  switchDaily = (daily: boolean) => this.setState({ daily });

  //TimeDatePicker functions
  onDatePress = () => this.setState({ datePickerVisible: true });
  onDateConfirm = (datetime: Date) => {
    const momentDatetime = Moment(datetime);
    if (momentDatetime.isAfter(Moment())) {
      this.setState({
        dateTime: momentDatetime,
        datePickerVisible: false,
      });
    } else {
      this.setState({ datePickerVisible: false });
      alert(PLS_SELECT_TIME_AFTER_NOW);
    }
  };
  onDateCancel = () => this.setState({ datePickerVisible: false });
  onTimePress = () => this.setState({ timePickerVisible: true });
  onTimeConfirm = (timedate: Date) => {
    const momentTimeDate = Moment(timedate);
    if (momentTimeDate.isAfter(Moment())) {
      this.setState({
        dateTime: momentTimeDate,
        timePickerVisible: false,
      });
    } else {
      this.setState({ timePickerVisible: false });
      alert(PLS_SELECT_TIME_AFTER_NOW);
    }
  };
  onTimeCancel = () => this.setState({ timePickerVisible: false });

  //adding/showing a group
  onPlusGroupPress = () => {
    this.setState({
      groupsModalVisible: true
    })
  }

  addGroup = (group: GroupI) => {
    let { allRemainingGroups, groups } = this.state;
    //add group to selected groups for to-do
    groups.push(group)
    //remove groupd from remaining groups
    //index of group in remaining groups which should get removed
    const remainingGroupIndex = allRemainingGroups.findIndex((remainingGroup: GroupI) => remainingGroup.id === group.id);
    allRemainingGroups.splice(remainingGroupIndex, 1);

    this.setState({ allRemainingGroups, groups, groupsModalVisible: false });
  }

  renderAddedGroup = (group: GroupI, index: number) => {
    return (
      <OwnView style={styles.groupContainer} key={index}>
        <OwnText text={group.name} style={styles.groupName} />
        <OwnButton onPress={() => this.removeAddedGroup(group)}>
          <OwnIcon iconSet="MaterialCommunity" name="trash-can" size={35} />
        </OwnButton>
      </OwnView>
    )
  }

  removeAddedGroup = (group: GroupI) => {
    let { allRemainingGroups, groups } = this.state;
    //add groups to remaining groups
    allRemainingGroups.push(group);
    //remove group from addedGroups
    const addedGroupIndex = groups.findIndex((addedGroup: GroupI) => addedGroup.id === group.id);
    groups.splice(addedGroupIndex, 1);

    this.setState({ allRemainingGroups, groups });
  }

  render() {
    const { name, notes, daily, dateTime, datePickerVisible,
      timePickerVisible, groups, allRemainingGroups, groupsModalVisible } = this.state;
    return (
      <OwnView style={globalStyles.screenContainer}>
        <ScrollView>
          <OwnTextInput
            style={styles.nameInput}
            placeholder={NAME}
            autoFocus={true}
            value={name}
            onChangeText={this.changeName}
          />
          <OwnTextInput
            style={styles.notesInput}
            multiline={true}
            placeholder={NOTES}
            value={notes}
            onChangeText={this.changeNotes}
          />
          <OwnView style={styles.switchContainer}>
            <OwnIcon
              name={'calendar-clock'}
              label={DAILY}
              showLabel={true}
              iconSet={'MaterialCommunity'}
              size={35}
            />
            <OwnSwitch
              style={styles.switch}
              value={daily}
              onValueChange={this.switchDaily}
            />
          </OwnView>
          <TimeDatePicker
            allDay={true}
            value={dateTime.toDate()}
            dateFunctions={{ onPress: this.onDatePress, onCancel: this.onDateCancel, onConfirm: this.onDateConfirm }}
            timeFunctions={{ onPress: this.onTimePress, onConfirm: this.onTimeConfirm, onCancel: this.onTimeCancel }}
            dateVisible={datePickerVisible}
            timeVisible={timePickerVisible} />
          <OwnView style={globalStyles.groupSectionContainer}>
            <SectionIconHeader title={GROUPS} onIconPress={this.onPlusGroupPress} />
            {groups.length > 0 &&
              <OwnView style={globalStyles.groupHeaderUnderline} />}
            {groups.map((group: GroupI, index: number) => this.renderAddedGroup(group, index))}
          </OwnView>
          <Modal visible={groupsModalVisible} transparent={true}>
            <OwnView style={styles.groupsModalContainer}>
              <OwnView style={styles.groupsModalInnerContainer}>
                {
                  allRemainingGroups.map((group, index) => <OwnButton key={index} text={group.name} textStyle={styles.groupsModalName} onPress={() => this.addGroup(group)} />)
                }
              </OwnView>
            </OwnView>
          </Modal>
        </ScrollView>
      </OwnView>
    );
  }
}

const styles = StyleSheet.create({
  //i can probably remove fontSize: 25 because it is by default in OwnTextInput
  nameInput: {
    fontSize: 25,
    borderBottomWidth: 1,
  },
  notesInput: {
    fontSize: 25,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    padding: 5,
    paddingRight: 30,
  },
  switch: {
    transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
  },
  //groups
  groupContainer: {
    width: "100%",
    flexDirection: "row",
    padding: 5,
    justifyContent: "space-between",
    alignItems: "center"
  },
  groupName: {
    fontSize: 25
  },
  //modal for remaining groups
  groupsModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent"
  },
  groupsModalInnerContainer: {
    padding: 100,
    borderWidth: 1,
    borderRadius: 10
  },
  groupsModalName: {
    fontSize: 25,
    padding: 3
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(NewToDo);
