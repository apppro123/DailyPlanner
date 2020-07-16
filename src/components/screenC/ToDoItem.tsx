import React from 'react';
import {StyleSheet, Alert, Dimensions} from 'react-native';
//own componetns
import {OwnButton, OwnCheckBox, OwnView, OwnIcon} from '../basicC';
//interfaes
import {ToDoI} from 'res';
//strings
import {Strings} from 'res';
const {CANCEL, DELETE_TODO, WANT_DELETE_TODO} = Strings;
//styles
import {globalStyles} from '../../screens/style';

interface PropsI <NavigationType>{
  checked: boolean;
  item: ToDoI;
  index: number;
  deleteToDo: (id: string, index: number) => void;
  onCheckSwitch: (checked: boolean, id: string, index: number) => void;
  postponeItem?: (index: number, item: ToDoI) => void;
  navigation: NavigationType
}

export class ToDoItem<NavigationType> extends React.Component<PropsI<NavigationType>> {
  shouldComponentUpdate(nextProps: PropsI<NavigationType>) {
    if (nextProps.checked !== this.props.checked) {
      return true;
    } else if (nextProps.item.name !== this.props.item.name) {
      return true;
    } else if (nextProps.item.daily !== this.props.item.daily){
      return true;
    }
    return false;
  }

  askDeleteToDo = () => {
    const {item, index} = this.props;
    Alert.alert(DELETE_TODO, WANT_DELETE_TODO, [
      {text: CANCEL, style: 'cancel'},
      {text: 'OK', onPress: () => this.props.deleteToDo(item.id, index)},
    ]);
  };

  onCheckSwitch = () => {
    const {item, index} = this.props;
    this.props.onCheckSwitch(!this.props.checked, item.id, index);
  };

  postponeItem = () => {
    const {index, item} = this.props;
    this.props.postponeItem && this.props.postponeItem(index, item);
  };

  navigateToChange = () => {
    const {navigation, item} = this.props;
    navigation.navigate('ChangeToDoStackN', {
      screen: 'ChangeToDo',
      params: {toDo: item},
    });
  };

  render() {
    const {checked = false, item} = this.props;
    const {daily, name, done} = item;
    return (
    <OwnView style={styles.container}>
      <OwnView style={styles.checkTextContainer}>
        <OwnCheckBox checked={checked} onPress={this.onCheckSwitch} />
        <OwnButton
          onPress={this.navigateToChange}
          textStyle={styles.text}
          text={name}
        />
      </OwnView>
      {!daily && (
        <OwnView style={styles.buttonsContainer}>
          <OwnButton
            onPress={this.askDeleteToDo}
            style={globalStyles.deleteButton}>
            <OwnIcon iconSet="MaterialCommunity" name="trash-can" size={35} />
          </OwnButton>
            <OwnButton onPress={this.postponeItem}>
              <OwnIcon
                iconSet="MaterialCommunity"
                name="arrow-right"
                size={35}
              />
            </OwnButton>
        </OwnView>
      )}
    </OwnView>)
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  checkTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    width: Dimensions.get('window').width - 190,
  },
  buttonsContainer: {
    width: 100,
    flexDirection: 'row',
  },
});
