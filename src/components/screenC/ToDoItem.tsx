import React from 'react';
import { StyleSheet, Alert, Dimensions } from 'react-native';
//own componetns
import { OwnButton, OwnCheckBox, OwnView, OwnIcon } from '../basicC';
//interfaes
import { ToDoI } from 'res';
//strings
import { Strings } from 'res';
const { CANCEL, DELETE_TODO, WANT_DELETE_TODO } = Strings;
//styles
import { globalStyles } from '../../screens/style';

interface PropsI<NavigationType> {
  item: ToDoI;
  deleteToDo: (id: string) => void;
  onCheckSwitch: (checked: boolean, id: string) => void;
  postponeItem?: (item: ToDoI) => void;
  navigation: NavigationType
}

export class ToDoItem<NavigationType> extends React.Component<PropsI<NavigationType>> {
  shouldComponentUpdate(nextProps: PropsI<NavigationType>) {
    return true;
    /* not working with nextProps, somehow it is always the same as this.props:(
    if (nextProps.item.done !== this.props.item.done) {
      return true;
    } else if (nextProps.item.name !== this.props.item.name) {
      return true;
    }
    return false; */
  }

  askDeleteToDo = () => {
    const { item } = this.props;
    Alert.alert(DELETE_TODO, WANT_DELETE_TODO, [
      { text: CANCEL, style: 'cancel' },
      { text: 'OK', onPress: () => this.props.deleteToDo(item.id) },
    ]);
  };

  onCheckSwitch = () => {
    const { item } = this.props;
    const { done, id } = item;
    this.props.onCheckSwitch(!done, id);
  };

  postponeItem = () => {
    const { item } = this.props;
    this.props.postponeItem && this.props.postponeItem(item);
  };

  navigateToChange = () => {
    const { navigation, item } = this.props;
    navigation.navigate('ChangeToDoStackN', {
      screen: 'ChangeToDo',
      params: { toDo: item },
    });
  };

  render() {
    const { item } = this.props;
    const { name, done = false } = item;
    return (
      <OwnView style={styles.container}>
        <OwnView style={styles.checkTextContainer}>
          <OwnCheckBox checked={done} onPress={this.onCheckSwitch} />
          <OwnButton
            onPress={this.navigateToChange}
            textStyle={styles.text}
            text={name}
          />
        </OwnView>

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
