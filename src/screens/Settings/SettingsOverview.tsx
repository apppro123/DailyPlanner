import React from "react";
import {StyleSheet} from "react-native";
//navigation
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import { SettingsStackNTypes } from "../types";
//components
import {OverviewList, OwnText, OwnView, OwnButton} from "components";
//strings
import { SettingStrings} from "res";
const { GROUPS } = SettingStrings;
//styles
import {globalStyles} from "../style";
const {screenContainer} = globalStyles; 

//navigation props
type SettingsNavigationProps = StackNavigationProp<SettingsStackNTypes, "SettingsOverview">;
//type NewToDoRouteProps = RouteProp<ChangeTodoStackNTypes, "ChangeToDo">

interface PropsI {
    navigation: SettingsNavigationProps
}

interface StateI {
 settingsOptions: {renderItem: () => any}[]   
}

class SettingsOverview extends React.Component<PropsI, StateI> {
    constructor(props: PropsI){
        super(props);

        const settingsOptions = [{renderItem: () => this.renderNormalItem(GROUPS)}];

        this.state = {
            settingsOptions: settingsOptions
        }
    }

    //get a title 
    renderNormalItem = (title: string) => {
        const {navigation}  = this.props
        return (
            <OwnButton style={styles.itemContainer} onPress={() => navigation.navigate("GroupsOverview")}>
                <OwnText style={styles.itemText} text={title}/>
            </OwnButton>
        )
    }

    renderItem = ({item, index}) => {
        return item.renderItem();
    }
    
    render() {
        return(
            <OwnView style={screenContainer}>
                <OverviewList data={this.state.settingsOptions} renderItem={this.renderItem}/> 
            </OwnView>
        )
    }
}

const styles = StyleSheet.create({
    itemContainer: {
        width: "100%",
        height: 100,
        justifyContent: "center",
    },
    itemText: {
        fontSize: 20
    }
})

export default SettingsOverview;