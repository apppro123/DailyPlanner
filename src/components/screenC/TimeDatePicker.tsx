import React from 'react';
import { StyleSheet } from 'react-native';
import DateTimePicker from "react-native-modal-datetime-picker";
import Moment from 'moment';
import { Strings, ToDoStrings } from 'res';
const { CONFIRM, CANCEL } = Strings;
const { PICK_DATE, PICK_TIME } = ToDoStrings;
import { OwnView, OwnText, OwnIcon } from '../basicC';

interface TimeDatePickerProps {
  value: Date,
  dateFunctions: {
    onPress: () => void,
    onConfirm: (date: Date) => void,
    onCancel: () => void
  },
  timeFunctions: {
    onPress: () => void,
    onConfirm: (date: Date) => void,
    onCancel: () => void
  },
  dateVisible: boolean,
  timeVisible: boolean,
  //if event is all day, so it doesn't need TimePart
  allDay: boolean
}

export const TimeDatePicker = ({
  value,
  dateFunctions,
  timeFunctions,
  dateVisible,
  timeVisible,
  allDay
}: TimeDatePickerProps) => {
  return (
    <OwnView style={styles.container}>
      <DatePart functions={dateFunctions} value={value} visible={dateVisible} />
      {!allDay && <TimePart functions={timeFunctions} value={value} visible={timeVisible} />}
    </OwnView>
  );
};

const DatePart = ({ functions, value, visible }) => {
  const { onPress, onConfirm, onCancel } = functions;
  return (
    <OwnView style={styles.partContainer}>
      <OwnIcon name={'clock-start'} iconSet="MaterialCommunity" size={30} />
      <OwnText
        style={styles.dateText}
        onPress={onPress}
        text={Moment(value).format('L')}
      />
      <DateTimePicker
        date={value}
        mode="date"
        headerTextIOS={PICK_DATE}
        confirmTextIOS={CONFIRM}
        cancelTextIOS={CANCEL}
        display="spinner"
        isVisible={visible}
        is24Hour={true}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </OwnView>
  );
};

const TimePart = ({ functions, value, visible }) => {
  const { onPress, onConfirm, onCancel } = functions;
  return (
    <OwnView style={styles.partContainer}>
      <OwnText
        style={styles.timeText}
        onPress={onPress}
        text={Moment(value).format('LT')}
      />
      <DateTimePicker
        date={value}
        mode="time"
        headerTextIOS={PICK_TIME}
        confirmTextIOS={CONFIRM}
        cancelTextIOS={CANCEL}
        is24Hour={true}
        display="spinner"
        isVisible={visible}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </OwnView>
  );
};

const styles = StyleSheet.create({
  dateText: {
    marginLeft: 40,
    textAlign: 'center',
    fontSize: 18,
    textAlignVertical: 'center',
  },
  timeText: {
    textAlign: 'center',
    fontSize: 18,
    textAlignVertical: 'center',
  },
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 10,
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  partContainer: {
    flexDirection: 'row',
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
