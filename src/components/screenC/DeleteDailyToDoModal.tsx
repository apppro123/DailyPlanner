import React from 'react';
import { Modal, StyleSheet } from 'react-native';
//own components
import { OwnText, OwnCheckBox, OwnButton, OwnView } from '../basicC';
//strings
import { ToDoStrings, ToDosOverviewStrings, Strings } from 'res';
const { CHOOSE_DAYS_KEEP_TODO } = ToDoStrings;
const { YESTERDAY, TODAY, TOMORROW } = ToDosOverviewStrings;
const { CANCEL } = Strings;

//define days
const days = [YESTERDAY, TODAY, TOMORROW];

interface PropsI {
  visible: boolean,
  onDeleteDailyToDo: (selectedDayIndexes: number[]) => void,
  onCancel: () => void
}

interface StateI {
  selectedDayIndexes: number[]
}

export class DeleteDailyToDoModal extends React.Component<PropsI, StateI> {
  state = {
    selectedDayIndexes: [1],
  };

  shouldComponentUpdate(nextProps: PropsI, nextState: StateI) {
    if (nextProps.visible !== this.props.visible) {
      return true;
    } else if (nextState.selectedDayIndexes.length !== this.state.selectedDayIndexes.length) {
      return true;
    } else {
      return false
    }
  }

  noAction = () => {
    return;
  };

  onChangeSelect = (indexToChange: number) => {
    //i clone array because splice directly affects the array and so it would notice update in length of array (in shouldComponentUpdate) on setState
    let oldSelectedDayIndexes = [...this.state.selectedDayIndexes];
    let indexInSelectedDayIndexes = oldSelectedDayIndexes.indexOf(
      indexToChange
    );
    if (indexInSelectedDayIndexes > -1) {
      //index was selected
      oldSelectedDayIndexes.splice(indexInSelectedDayIndexes, 1);
    } else {
      oldSelectedDayIndexes.push(indexToChange);
    }
    this.setState({ selectedDayIndexes: oldSelectedDayIndexes });
  };

  render() {
    return (
      <Modal
        animationType="slide"
        visible={this.props.visible}
        onRequestClose={this.noAction}>
        <OwnView style={styles.modal}>
          <OwnView style={styles.mainInnerContainer}>
            <OwnText text={CHOOSE_DAYS_KEEP_TODO} style={styles.mainText} />
            {days.map((day, index) => {
              const selected = this.state.selectedDayIndexes.includes(index);
              return (
                <OwnView key={index.toString()} style={styles.dayContainer}>
                  <OwnCheckBox
                    checked={selected}
                    onPress={() => this.onChangeSelect(index)}
                  />
                  <OwnText text={day} />
                </OwnView>
              );
            })}
            <OwnView style={styles.buttonContainer}>
              <OwnButton
                text={'OK'}
                onPress={() =>
                  this.props.onDeleteDailyToDo(
                    this.state.selectedDayIndexes
                  )
                }
              />
              <OwnButton text={CANCEL} onPress={this.props.onCancel} />
            </OwnView>
          </OwnView>
        </OwnView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainInnerContainer: {
    flexDirection: 'column',
    borderWidth: 1,
    borderRadius: 10,
    margin: 10,
  },
  mainText: {
    fontSize: 25,
  },
  dayContainer: {
    flexDirection: 'row',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
});
