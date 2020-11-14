import React from "react";
import { Switch, StyleSheet } from "react-native";
import OwnView from "./View";
import OwnText from "./Text";

interface OwnSwitchProps {
    onValueChange: (value: boolean) => void,
    value: boolean,
    style?: {},
}

//for ios it is possible that style needs ios_backgroundColor in addition

const OwnSwitch = ({ onValueChange, value, style }: OwnSwitchProps) => {
    return (
        <Switch style={style} /*trackColor={"#BDBDBD"} thumbColor={theme.secondary} tintColor={"#58D3F7"}*/
            value={value}
            onValueChange={onValueChange} />
    )
}


export default OwnSwitch