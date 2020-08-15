import {StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');;

export const globalStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    padding: 10,
  },
  deleteButton: {
    borderRadius: 0,
    alignItems: 'flex-start',
  },
  listItemContainer: {
    width: "100%",
    height: 50
  },
  //for groups under change-/addToDo
  groupSectionContainer: {
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 10,
  },
  groupHeaderUnderline: {
    borderWidth: 1,
    height: 0,
    width: width - 20,
  },
});
