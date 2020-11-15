import React from "react";
import {StyleSheet} from "react-native";
//navigation
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { SettingsStackNTypes } from "../../types";
//components
import { OwnText, OwnView, OverviewList, OwnButton } from "components";
//redux
import { connect } from "react-redux";
import {
    refreshGroupList
} from "../../../redux/actions";
import { RootStateType } from "src/redux/reducers";
//strings
import { SettingStrings, GroupI } from "res";
const { GROUPS } = SettingStrings;
//styles
import { globalStyles } from "../../style";
import { GroupDB } from "db_vasern";
const { listItemContainer, screenContainer } = globalStyles;

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

interface PropsI extends PropsFromRedux{
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
        const groups = this.props.route.params?.groups;
        if (groups) {
            this.setState({ groups: groups });
        }
    }

    renderGroup = ({ item, index }) => {
        return (
            <OwnButton style={listItemContainer} onPress={() => this.onGroupPress(item.id)}>
                <OwnText style={styles} text={item.name} />
            </OwnButton>
        )
    }

    onGroupPress = (id: string) => {
        const { navigate } = this.props.navigation;
        navigate("Group", { mode: "change", groupId: id, addDisabled: false });
    }

    render() {
        const {refreshGroupOverview, allGroups} = this.props.Settings;
        return (
            <OwnView style={screenContainer}>
                <OverviewList
                    data={allGroups}
                    renderItem={this.renderGroup} 
                    extraData={refreshGroupOverview}/>
            </OwnView>
        )
    }
}

const styles = StyleSheet.create({
    groupName: {
        fontSize: 20
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(GroupsOverview);