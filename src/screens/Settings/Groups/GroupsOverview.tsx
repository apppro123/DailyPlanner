import React from "react";
//navigation
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { SettingsStackNTypes } from "../../types";
//components
import { OwnText, OwnView, OverviewList, OwnButton } from "components";
//db realm
import { getAllGroups } from "db_realm";
//strings
import { SettingStrings, GroupI } from "res";
const { GROUPS } = SettingStrings;
//styles
import { globalStyles } from "../../style";
const { listItemContainer, screenContainer } = globalStyles;

//navigation props
type GroupsOverviewNavigationProps = StackNavigationProp<SettingsStackNTypes, "GroupsOverview">;
type GroupsOverviewRouteProps = RouteProp<SettingsStackNTypes, "GroupsOverview">

interface PropsI {
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
        let allGroups = await getAllGroups();
        this.setState({ groups: allGroups });

        //add onFocusListener to refresh group after change/add group, 
        //because constructor/componentDidMount doesn't get called anymore
        this.unsubscribeFocus = this.props.navigation.addListener(
            "focus",
            this.refreshGroups,
        );
    }

    componentWillUnmount(){
        this.unsubscribeFocus();
    }

    refreshGroups = () => {
        const groups = this.props.route.params?.groups;
        if(groups){
            this.setState({groups: groups});
        }
    }

    renderGroup = ({ item, index }) => {
        return (
            <OwnButton style={listItemContainer} onPress={() => this.onGroupPress(item.id)}>
                <OwnText text={item.name} />
            </OwnButton>
        )
    }

    onGroupPress = (id: string) => {
        const { navigate } = this.props.navigation;
        navigate("Group", { mode: "change", groupId: id, addDisabled: false });
    }

    render() {
        return (
            <OwnView style={screenContainer}>
                <OverviewList data={this.state.groups} renderItem={this.renderGroup} extraData={this.state.groups.length}/>
            </OwnView>
        )
    }
}

export default GroupsOverview;