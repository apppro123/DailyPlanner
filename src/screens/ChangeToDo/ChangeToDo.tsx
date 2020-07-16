import React from 'react';
import { StyleSheet } from 'react-native';
//db
import { updateToDo } from 'db_realm';
//redux
import { connect } from 'react-redux';
import { setRefreshAllToDos } from '../../redux/actions';
//components
import DateTimePicker from '@react-native-community/datetimepicker';
//own components
import {
  OwnView,
  OwnTextInput,
  OwnButton,
  OwnSwitch,
  OwnIcon
} from 'components';
//navigation
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { BottomTabNTypes, ChangeTodoStackNTypes } from "../types";
//strings
import { Strings, GroupI } from 'res';
const { NAME, NOTES, CHANGE, DAILY, CHANGE_TODO } = Strings;
//interfaces and types
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
  setRefreshAllToDos
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
  date: Moment.Moment
  daily: boolean,
  groups: GroupI[]
}

class ChangeToDo extends React.Component<PropsI, StateI> {
  removeFocusListener: any;

  constructor(props) {
    super(props);
    //get to-do
    const { name, notes, daily, date } = this.props.route.params?.toDo;
    this.state = {
      name: name,
      notes: notes,
      date: Moment(date),
      daily: daily,
      groups: []
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
  }

  componentWillUnmount() {
    this.removeFocusListener();
  }

  //change to-do
  changeAfterFocus = () => {
    const { name, notes, daily, date } = this.props.route.params.toDo;
    this.setState({
      name: name,
      notes: notes,
      date: Moment(date),
      daily: daily,
    });
  };

  //add new to do
  changeToDo = async () => {
    const oldToDo = this.props.route.params.toDo;
    const { name, notes, daily, date, groups } = this.state;

    let changedToDo = {
      id: oldToDo.id,
      name: name.trim(),
      notes: notes.trim(),
      date: date.toDate(),
      daily,
      groups: groups,
      done: oldToDo.done
    };
    const allToDos = await updateToDo(changedToDo);
    this.props.setRefreshAllToDos(allToDos);
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

export default connect(
  mapStateToProps,
  { setRefreshAllToDos },
)(ChangeToDo);
