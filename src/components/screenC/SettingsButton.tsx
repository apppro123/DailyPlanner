import React from "react";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native"
import {OwnButton, OwnIcon} from "../basicC";

function SettingsButton() {
    const navigation = useNavigation();
    function openSettings() {
        /* navigation.navigate("SettingsStackN", {
            screen: "SettingsOverview"
        }); */
    }
    return(
        <OwnButton onPress={openSettings} style={styles.settingsButton}>
            <OwnIcon iconSet="MaterialCommunity" name="cog" size={60}/>
        </OwnButton>
    )
}

export default SettingsButton;