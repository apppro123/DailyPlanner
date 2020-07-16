//picker that stays in ios at the bottom
import React from "react";
import { Modal, TouchableWithoutFeedback, Dimensions, StyleSheet, Platform } from "react-native";
//own components
import OwnButton from "./Button";
import OwnPicker from "./Picker";
import OwnView from "./View";

import styled, { withTheme } from "styled-components/native";
//strings
import { Strings } from "res";
const { CANCEL, CONFIRM } = Strings;

const { width, height } = Dimensions.get("window");

const isIphoneX = () => {
    return (
        Platform.OS === "ios" &&
        !Platform.isPad &&
        !Platform.isTVOS &&
        (height === 812 || width === 812)
    );
};

const ConfirmButton = styled(props => <OwnButton {...props} />)`
    background-color: transparent;
    border-top-width: ${StyleSheet.hairlineWidth};
    height: 50;
    width: ${width - 20};
    justify-content: center;
    align-items: center;
`
const CancelButton = styled(props => <OwnButton {...props} />)`
    border-width: 1px;
    border-radius: 13px;
    height: 50px;
    margin: 10px;
    marginBottom: ${isIphoneX() ? 20 : 0}px;
    align-items: center;
    justify-content: center;
    width: ${width - 20}px
`

interface PropsI {
    selectedValue: any,
    onCancel: () => void,
    onConfirm: (any) => void,
    visible: boolean,
    style?: {},
    itemStyle?: {}
}

interface StateI {
    value: any
}

class PickerBottom extends React.PureComponent<PropsI, StateI> {
    constructor(props: PropsI) {
        super(props);

        this.state = {
            value: props.selectedValue
        }
    }

    onValueChange = (value) => {
        this.setState({ value });
    }

    onCancel = () => {
        const { selectedValue } = this.props;
        this.setState({value: selectedValue});
        this.props.onCancel();
    }
    noCancel = () => { return }

    onConfirmButton = () => this.props.onConfirm(this.state.value)

    render() {
        const { visible,
            children, style, itemStyle } = this.props;
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                presentationStyle="overFullScreen"
                onRequestClose={this.noCancel}>
                <OwnButton style={styles.backgroundButton} onPress={this.onCancel}>
                    <TouchableWithoutFeedback onPress={this.noCancel}>
                        <OwnView style={styles.container}>
                            <OwnView style={styles.pickerContainer}>
                                <OwnPicker onValueChange={this.onValueChange} selectedValue={this.state.value}
                                    style={[styles.bottomPicker, style]} itemStyle={itemStyle} boxStyle={styles.bottomPickerBox}>
                                    {children}
                                </OwnPicker>
                                <ConfirmButton text={CONFIRM} onPress={this.onConfirmButton} />
                            </OwnView>
                            <CancelButton text={CANCEL} onPress={this.onCancel} />
                        </OwnView>
                    </TouchableWithoutFeedback>
                </OwnButton>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    bottomPickerBox: {
        backgroundColor: "transparent"
    },
    backgroundButton: {
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "transparent",
        width: width,
        height: height
    },
    container: {
        alignItems: "center",
        backgroundColor: "transparent",
        width: width
    },
    pickerContainer: {
        borderWidth: 1,
        borderRadius: 13,
        width: width - 20,
        alignItems: "center",
        margin: 10
    },
    bottomPicker: {
        width: width - 20,
        backgroundColor: "transparent"
    }
})

export default withTheme(PickerBottom)