import React from 'react';
//navigation
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/native-stack';
import {SettingsStackNTypes} from '../../types';
//vasern
import {GroupDB} from 'db_vasern';
//redux
import {connect} from 'react-redux';
import {refreshGroupList} from '../../../redux/actions';
import {RootStateType} from 'src/redux/reducers';
//components
import {OwnView, OwnTextInput, OwnButton} from 'components';
//strings
import {SettingStrings, GroupI, Strings} from 'res';
const {NAME, NOTES, ADD, DAILY, CHANGE} = Strings;
const {GROUPS} = SettingStrings;
//styles
import {globalStyles} from '../../style';
const {screenContainer} = globalStyles;

//typescript for redux
const mapStateToProps = (state: RootStateType) => {
  return {};
};

const mapDispatchToProps = {
  refreshGroupList,
};
type PropsFromRedux = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

//navigation props
type GroupNavigationProps = StackNavigationProp<SettingsStackNTypes, 'Group'>;
type GroupRouteProps = RouteProp<SettingsStackNTypes, 'Group'>;

interface PropsI extends PropsFromRedux {
  navigation: GroupNavigationProps;
  route: GroupRouteProps;
}

interface StateI {
  name: string;
  notes: string;
}

class Group extends React.Component<PropsI, StateI> {
  state = {
    name: '',
    notes: '',
  };

  async componentDidMount() {
    //mode determines if it changes an existing group
    //so it gets group id to get the properties of this group
    //or if it creates a new group
    //possible values are "new" | "change"
    const {mode, groupId} = this.props.route.params;
    let textForHeaderRight = ADD;
    if (mode === 'change' && groupId) {
      //change text button
      textForHeaderRight = CHANGE;
      //fetch group by id
      const group = GroupDB.get({id: groupId});
      let {name, notes} = group;
      this.setState({name: name, notes: notes});
    }
    this.props.navigation.setOptions({
      headerRight: () => (
        <OwnButton
          onPress={this.addOrChangeGroup}
          disabled={this.props.route.params?.addDisabled}
          text={textForHeaderRight}
        />
      ),
    });
  }

  //add group
  addOrChangeGroup = async () => {
    const {name, notes} = this.state;
    //see if group already exists or not
    const {mode, groupId} = this.props.route.params;
    let allGroups = [] as GroupI[];
    if (mode === 'change' && groupId) {
      //change group
      let changedGroup = {
        name: name,
        notes: notes,
      };
      await GroupDB.update(groupId, changedGroup);

      //allGroups =
    } else {
      //create new group
      let newGroup = {
        name: name,
        notes: notes,
      } as GroupI;
      await GroupDB.insert(newGroup);
    }
    this.props.refreshGroupList();
    this.props.navigation.goBack();
  };

  //change inputs
  changeName = (name: string) => {
    if (name.trim() == '') {
      this.props.navigation.setParams({addDisabled: true});
    } else if (this.state.name.trim() == '') {
      this.props.navigation.setParams({addDisabled: false});
    }
    this.setState({name});
  };
  changeNotes = (notes: string) => this.setState({notes});

  render() {
    const {name, notes} = this.state;
    return (
      <OwnView style={screenContainer}>
        <OwnTextInput
          placeholder={NAME}
          autoFocus={true}
          value={name}
          onChangeText={this.changeName}
        />
        <OwnTextInput
          multiline={true}
          placeholder={NOTES}
          value={notes}
          onChangeText={this.changeNotes}
        />
      </OwnView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Group);
