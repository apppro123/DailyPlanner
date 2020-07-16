import React from "react";
import {StyleSheetProperties} from "react-native";
//own componetns
import OwnIcon from "./Icon";
import OwnButton from "./Button";

interface PropsI {
    checked: boolean,
    onPress: () => void,
    style?: {}
}

export default class OwnCheckBox extends React.PureComponent<PropsI> {
    render(){
        const {
            checked=false,
            onPress,
            style
        } = this.props;
        const name = checked ? "checkbox-marked-outline" : "checkbox-blank-outline";
        return(
            <OwnButton onPress={onPress} style={style}>
                <OwnIcon name={name} iconSet={"MaterialCommunity"} size={35}/>
            </OwnButton>
        )
    }
}