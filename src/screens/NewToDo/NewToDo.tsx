import React from 'react';
import { StyleSheet } from 'react-native';
import Moment from "moment";
//db
import { insertNewToDo } from 'db_realm';
//uuid generator
import UUIDGenerator from 'react-native-uuid-generator';
//redux
import { connect } from 'react-redux';
import { refreshDailyList, refreshPastList, refreshTodayList, refreshFutureList } from "../../redux/actions";
//components
import DateTimePicker from '@react-native-community/datetimepicker';
//own components
import {
  OwnView,
  OwnTextInput,
  OwnButton,
  OwnSwitch,
  OwnIcon,
} from 'components';
//realm
import {getAllGroups} from "db_realm";
//navigation
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BottomTabNTypes, NewToDoStackNTypes } from "../types";
//strings
import { Strings, GroupI } from 'res';
const { NAME, NOTES, ADD, DAILY } = Strings;
//interfaces and types
import { ToDoI } from "res";
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
  date: Moment.Moment,
  groups: GroupI[],
  allGroups: GroupI[]
}

//real screen
class NewToDo extends React.Component<PropsI, StateI> {
  unsubscribeFocus: any
  unsubscribeBlur: any

  state = {
    name: '',
    notes: '',
    daily: false,
    date: Moment(),
    groups: [],
    allGroups: []
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
    //add listener, because constructor/componentDidMount doesn't get called anymore
    this.unsubscribeFocus = this.props.navigation.addListener(
      "focus",
      this.refreshDayState,
    );
    this.unsubscribeBlur = this.props.navigation.addListener(
      "blur",
      this.refreshTextInputState
    );

    //set all groups
    let allGroups = await getAllGroups();
    this.setState({
      daily,
      allGroups
    })
  }

  componentWillUnmount() {
    this.unsubscribeFocus();
    this.unsubscribeBlur();
  }

  refreshTextInputState = () => {
    this.setState({
      name: "",
      notes: "",
    })
  }

  refreshDayState = () => {
    this.props.navigation.setParams({ addDisabled: true });
    //test where the navigator is/was
    const { routes, history } = this.props.Navigators.state;
    let daily = false;
    //in the beginning state didn't get changed yet so object is empty
    if (history && routes) {
      daily = this.checkDaily(history);
    }

    this.setState({
      daily: daily,
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
    const { name, notes, daily, date } = this.state;
    //id
    const uuid = await UUIDGenerator.getRandomUUID();
    let newToDo = {
      id: uuid,
      name: name.trim(),
      notes: notes.trim(),
      daily,
      date: date.toDate()
    } as ToDoI;
    await insertNewToDo(newToDo);
    //inset into redux state
    const { refreshPastList, refreshTodayList, refreshFutureList, refreshDailyList, ToDos } = this.props;
    const { dailyToDos, pastToDos, todayToDos, futureToDos } = ToDos
    if (daily) {
      //add to-do to daily and today to-dos
      dailyToDos.push(newToDo);
      todayToDos.push(newToDo);
      //refresh lists
      refreshTodayList();
      refreshDailyList();
    } else if (date.isBefore(Moment().startOf("day"))) {
      //past to-dos
      pastToDos.push(newToDo);
      refreshPastList()
    } else if (date.isAfter(Moment().endOf("day"))) {
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

  //change date
  setDate = (event, newDate?: Date) => {
    if (newDate) {
      this.setState({ date: Moment(newDate) });
    }
  }

  render() {
    const { name, notes, daily } = this.state;
    return (
      <OwnView style={globalStyles.screenContainer}>
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
            value={this.state.daily}
            onValueChange={this.switchDaily}
          />
        </OwnView>
        {!daily && (
          <DateTimePicker value={this.state.date.toDate()} onChange={this.setDate} minimumDate={Moment().toDate()} is24Hour={true} />
        )}
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
});

export default connect(mapStateToProps, mapDispatchToProps)(NewToDo);
