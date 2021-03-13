import React from "react";
import { StyleSheet, Dimensions, Alert } from "react-native";
//navigation
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { SettingsStackNTypes } from "../../types";
//components
import { OwnView, OverviewList, OwnButton, OwnIcon } from "components";
//redux
import { connect } from "react-redux";
import {
    refreshGroupList
} from "../../../redux/actions";
import { RootStateType } from "../../../redux/reducers";
//strings
import { SettingStrings, GroupI, Strings } from "res";
const { GROUPS, DELETE_GROUP, WANT_DELETE_GROUP } = SettingStrings;
const { CANCEL } = Strings;
//styles
import { globalStyles } from "../../style";
import { GroupDB } from "db_vasern";
const { screenContainer } = globalStyles;

//typescript for redux
const mapStateToProps = (state: RootStateType) => {
    return {
        Settings: state.settings
    }
}
const mapDispatchToProps = {
    refreshGroupList
}
type PropsFromRedux = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

//navigation props
type GroupsOverviewNavigationProps = StackNavigationProp<SettingsStackNTypes, "GroupsOverview">;
type GroupsOverviewRouteProps = RouteProp<SettingsStackNTypes, "GroupsOverview">

interface PropsI extends PropsFromRedux {
    navigation: GroupsOverviewNavigationProps,
    route: GroupsOverviewRouteProps
}

interface StateI {
    groups: GroupI[]
}

class GroupsOverview extends React.Component<PropsI, StateI> {
    unsubscribeFocus: any;

    constructor(props: PropsI) {
        super(props);

        this.state = {
            groups: [] as GroupI[]
        }
    }

    async componentDidMount() {
        //set new groups
        let allGroups = GroupDB.data();
        this.setState({ groups: allGroups });

        //add onFocusListener to refresh group after change/add group, 
        //because constructor/componentDidMount doesn't get called anymore
        this.unsubscribeFocus = this.props.navigation.addListener(
            "focus",
            this.refreshGroups,
        );
    }

    componentWillUnmount() {
        this.unsubscribeFocus();
    }

    refreshGroups = () => {
        let allGroups = GroupDB.data();
        this.setState({ groups: allGroups });
    }

    askDeleteGroup = (id: string) => {
        Alert.alert(DELETE_GROUP, WANT_DELETE_GROUP, [
            { text: CANCEL, style: 'cancel' },
            { text: 'OK', onPress: () => this.deleteGroup(id) },
          ]);
    }

    deleteGroup = async (id: string) => {
        await GroupDB.remove(id);
        this.props.refreshGroupList();
    }

    renderGroup = ({ item, index }) => {
        return (
            <OwnView style={styles.listItemContainer}>
                <OwnButton onPress={() => this.onGroupPress(item.id)} textStyle={styles.groupName} text={item.name} />
                <OwnButton
                    onPress={() => this.askDeleteGroup(item.id)}
                    style={globalStyles.deleteButton}>
                    <OwnIcon iconSet="MaterialCommunity" name="trash-can" size={35} />
                </OwnButton>
            </OwnView>
        )
    }

    onGroupPress = (id: string) => {
        const { navigate } = this.props.navigation;
        navigate("Group", { mode: "change", groupId: id, addDisabled: false });
    }

    render() {
        const { refreshGroupOverview, allGroups } = this.props.Settings;
        return (
            <OwnView style={screenContainer}>
                <OverviewList
                    data={allGroups}
                    renderItem={this.renderGroup}
                    extraData={refreshGroupOverview} />
            </OwnView>
        )
    }
}

const styles = StyleSheet.create({
    listItemContainer: {
        flexDirection: "row",
        justifyContent: 'space-between',
    },
    groupName: {
        fontSize: 20,
        maxWidth: Dimensions.get('window').width - 50,
        maxHeight: 50, 
        
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(GroupsOverview);