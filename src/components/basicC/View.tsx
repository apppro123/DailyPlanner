import React from "react";
import { ViewProps } from "react-native";
import styled from "styled-components/native";
//interfaces
import { ThemeI } from "res";

const BasicView = styled.View<{theme: ThemeI}>`
    background-color: ${props => props.theme.colors.background};
    border-color: ${props => props.theme.colors.border};
    `

class OwnView extends React.PureComponent<ViewProps>{
    render() {
        const { style, children } = this.props;
        return (
            <BasicView style={style}>
                {children && children}
            </BasicView>
        )
    }
}

export default OwnView;