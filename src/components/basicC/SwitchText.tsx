import React from "react";
import { Switch, StyleSheet } from "react-native";
import OwnView from "./View";
import OwnText from "./Text";

interface OwnSwitchProps {
    onValueChange: (value: boolean) => void,
    value: boolean,
    style?: {},
    text?: string
}

//for ios it is possible that style needs ios_backgroundColor in addition

const OwnSwitchText = ({ onValueChange, value, style, text }: OwnSwitchProps) => {
    return (
        <OwnView style={styles.container}>
            {text && <OwnText text={text} style={styles.text}/>}
            <Switch style={style} /*trackColor={"#BDBDBD"} thumbColor={theme.secondary} tintColor={"#58D3F7"}*/
                value={value}
                onValueChange={onValueChange} />
        </OwnView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        padding: 5,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    text: {
        fontSize: 25
    }
})

export default OwnSwitchText