import React from 'react';
import {StyleSheet} from 'react-native';
//own components
import {OwnView, OwnButton} from '../basicC';
//strings
import {ToDosOverviewStrings} from 'res';
const {YESTERDAY, TODAY, TOMORROW} = ToDosOverviewStrings;

//define days
const days = [YESTERDAY, TODAY, TOMORROW];

interface PropsI {
  selectedDayIndex: number,
  onValueChange: (number) => void
}

export class SwitchDays extends React.Component<PropsI> {
  render() {
    const {selectedDayIndex, onValueChange} = this.props;
    return (
      <OwnView style={styles.container}>
        {days.map((day, index) => {
          //for border at bottom if selected
          let style = {} as {borderBottomWidth: number};
          const selected = index === selectedDayIndex;
          if (selected) {
            style.borderBottomWidth = 1;
          }
          //for borders between
          let containerStyle = {} as {borderLeftWidth: number};
          if(index !== 0){
            containerStyle.borderLeftWidth = 1;
          }

          return (
            <OwnView key={index.toString()} style={containerStyle}>
              <OwnButton
                selected={selected}
                style={style}
                textStyle={{fontSize: 25}}
                text={day}
                onPress={() => onValueChange(index)}
              />
            </OwnView>
          );
        })}
      </OwnView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-evenly',
    borderWidth: 1,
    borderRadius: 10,
  },
});
