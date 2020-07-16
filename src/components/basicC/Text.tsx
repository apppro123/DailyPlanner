import React from "react";
import { TextProps } from "react-native";
//theme
import styled, { withTheme } from "styled-components/native";
//interfaces
import { ThemeI } from "res";

const StyledText = styled.Text<{theme: ThemeI}>`
    border-radius: 10px;
    padding-left: 7px;
    padding-right: 7px;
    color: ${props => props.theme.colors.text};
    border-color: ${props => props.theme.colors.border};
`

interface Props extends TextProps {
    theme: ThemeI,
    text: string
}

class OwnText extends React.Component<Props> {
    shouldComponentUpdate(nextProps) {
        const { text, onPress, theme } = this.props;
        if (text !== nextProps.text) {
            return true;
        } else if (onPress !== nextProps.onPress) {
            return true;
        } else if (theme.colors.primary !== nextProps.theme.colors.primary) {
            return true;
        }
        return false
    }

    render() {
        const { ellipsizeMode, text, style, onPress, numberOfLines } = this.props;
        return (
            <StyledText ellipsizeMode={ellipsizeMode} numberOfLines={numberOfLines} style={style} onPress={onPress}>{text}</StyledText>
        )
    }
}

export default withTheme(OwnText);
