import React from 'react';
import { StyleSheet, Modal, ScrollView } from 'react-native';
//db
import { RecurrenceDB, GroupDB, ToDoDB } from "db_vasern";
//redux
import { connect } from 'react-redux';
import { refreshAllLists } from '../../redux/actions';
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
import { BottomTabNTypes, ChangeTodoStackNTypes } from "../types";
//strings, interfaces, types
import { Strings, GroupI, ToDoI, ToDoStrings, SettingStrings, RecurrenceI } from 'res';
const { NAME, NOTES, CHANGE, DAILY, CHANGE_TODO } = Strings;
const { GROUPS } = SettingStrings;
const { PLS_SELECT_TIME_AFTER_NOW } = ToDoStrings;
import { RootStateType } from 'src/redux/reducers';
//styles
import { globalStyles } from '../style';
import Moment from 'moment';

//typescript for redux
const mapStateToProps = (state: RootStateType) => {
  return {
  };
};
const mapDispatchToProps = {
  refreshAllLists
}
type PropsFromRedux = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

//navigation props
type NewToDoNavigationProps = CompositeNavigationProp<StackNavigationProp<ChangeTodoStackNTypes, "ChangeToDo">,
  BottomTabNavigationProp<BottomTabNTypes>>;
type NewToDoRouteProps = RouteProp<ChangeTodoStackNTypes, "ChangeToDo">

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

class ChangeToDo extends React.Component<PropsI, StateI> {
  removeFocusListener: any;
  removeBlurListener: any;

  constructor(props: PropsI) {
    super(props);
    //get to-do
    const { name, notes, recurrence, dateTime } = this.props.route.params?.toDo;
    this.state = {
      name: name,
      notes: notes,
      dateTime: Moment(dateTime),
      daily: recurrence ? true : false,
      groups: [] as GroupI[],
      allRemainingGroups: [] as GroupI[],
      datePickerVisible: false,
      timePickerVisible: false,
      groupsModalVisible: false
    };

    props.navigation.setParams({ changeDisabled: false });
    props.navigation.setOptions({
      title: CHANGE_TODO,
      headerLeft: () => (
        <OwnButton onPress={this.props.navigation.goBack}>
          <OwnIcon iconSet="MaterialCommunity" name="arrow-left" size={30} />
        </OwnButton>
      ),
      headerRight: () => (
        <OwnButton
          onPress={this.changeToDo}
          disabled={this.props.route.params?.changeDisabled}
          text={CHANGE}
        />
      ),
    });
    this.removeFocusListener = props.navigation.addListener('focus', this.changeAfterFocus);
    this.removeBlurListener = props.navigation.addListener(
      "blur",
      this.resetState
    );
  }

  async componentDidMount() {
    //set all groups
    let allRemainingGroups = GroupDB.data();
    this.setState({
      allRemainingGroups: allRemainingGroups
    })
  }

  componentWillUnmount() {
    this.removeFocusListener();
    this.removeBlurListener();
  }

  resetState = () => {
    this.setState({
      name: "",
      notes: "",
      dateTime: Moment(),
      groups: [] as GroupI[],
      allRemainingGroups: [] as GroupI[],
      datePickerVisible: false,
      timePickerVisible: false,
      groupsModalVisible: false
    })
  }

  //change to-do
  changeAfterFocus = () => {
    const { name, notes, recurrence, dateTime } = this.props.route.params.toDo;
    this.setState({
      name: name,
      notes: notes,
      dateTime: Moment(dateTime),
      daily: recurrence ? true : false,
    });
  };

  //add new to do
  changeToDo = async () => {
    const oldToDo = this.props.route.params.toDo;
    const { name, notes, daily, dateTime, groups } = this.state;

    let changedRecurrence = oldToDo.recurrence;
    if (!oldToDo.recurrence) {
      //if old recurrence was not set
      if (daily) {
        //now it has recurence
        changedRecurrence = { recurrenceRule: "daily" }
      }
    } else {
      //recurrence was set
      if (!daily) {
        //reccurrence is not set anymore

        changedRecurrence = undefined;
      }
      /* else{
        no more changes than daily to check
      } */
    }

    let changedToDo = {
      name: name.trim(),
      notes: notes.trim(),
      dateTime: dateTime.toISOString(),
      recurrence: changedRecurrence,
      //groupsIds: groups,
      done: oldToDo.done
    };
    ToDoDB.update(oldToDo.id, changedToDo);
    this.props.refreshAllLists();
    this.props.navigation.goBack();
  };

  //change inputs
  changeName = (name: string) => {
    if (name.trim() == '') {
      this.props.navigation.setParams({ changeDisabled: true });
    } else if (this.state.name.trim() == '') {
      this.props.navigation.setParams({ changeDisabled: false });
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
    if (momentDatetime.isAfter(Moment().startOf("day"))) {
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
    if (this.state.allRemainingGroups.length > 0) {
      this.setState({
        groupsModalVisible: true
      })
    } else {
      alert("No Groups left.")
    }
  }
  closeGroupModal = () => {
    this.setState({
      groupsModalVisible: false
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
    const { name, notes, daily, dateTime, datePickerVisible, timePickerVisible, groups, groupsModalVisible, allRemainingGroups } = this.state;
    return (
      <OwnView style={globalStyles.screenContainer}>
        <ScrollView>
          <OwnTextInput
            style={styles.nameInput}
            placeholder={NAME}
            autoFocus={true}
            value={name}
            onChangeText={this.changeName}
            multiline={true}
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
              value={this.state.daily}
              onValueChange={this.switchDaily}
            />
          </OwnView>
          {!daily && (
            <TimeDatePicker
              allDay={true}
              value={dateTime.toDate()}
              dateFunctions={{ onPress: this.onDatePress, onCancel: this.onDateCancel, onConfirm: this.onDateConfirm }}
              timeFunctions={{ onPress: this.onTimePress, onConfirm: this.onTimeConfirm, onCancel: this.onTimeCancel }}
              dateVisible={datePickerVisible}
              timeVisible={timePickerVisible} />
          )}
          <OwnView style={globalStyles.groupSectionContainer}>
            <SectionIconHeader title={GROUPS} onIconPress={this.onPlusGroupPress} />
            {groups.length > 0 &&
              <OwnView style={globalStyles.groupHeaderUnderline} />}
            {groups.map((group: GroupI, index: number) => this.renderAddedGroup(group, index))}
          </OwnView>
          <Modal visible={groupsModalVisible} transparent={true}>
            <OwnView style={styles.groupsModalContainer}>
              <OwnView style={styles.groupsModalInnerContainer}>
                <OwnButton style={styles.cancelModalButton} onPress={this.closeGroupModal}>
                  <OwnIcon iconSet="MaterialCommunity" name="close" size={35} />
                </OwnButton>
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
  },
  cancelModalButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangeToDo);