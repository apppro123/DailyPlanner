import React from 'react';
import {TouchableOpacityProps} from "react-native";
import styled from 'styled-components/native';
//interfaces
import { ThemeI} from "res";

interface TextProps extends ThemeI{
  disabled?: boolean,
  selected?: boolean
}

interface ButtonProps extends ThemeI {
  selected?: boolean
}

interface OwnButtonProps extends TouchableOpacityProps {
  text?: string;
  textStyle?: {};
  selected?: boolean;
}

const ButtonText = styled.Text<TextProps>`
  font-size: 20px;
  opacity: ${({disabled}) => disabled ? 0.5 : 1}
  color: ${({selected, theme}) =>
    selected ? theme.colors.primary : theme.colors.text};
`;

const Button = styled.TouchableOpacity<ButtonProps>`
  border-color: ${({theme}) => theme.colors.background};
  border-radius: 10px;
  padding-left: 7px;
  padding-right: 7px;
`;



class OwnButton extends React.PureComponent<OwnButtonProps> {
  static defaultProps = {
    style: {},
    activeOpacity: 0.2,
    textStyle: {},
  };

  render() {
    const {
      children,
      onPress,
      text,
      style,
      textStyle,
      disabled,
      selected,
      activeOpacity,
      onLongPress,
      onPressOut
    } = this.props;
    return (
      <Button
        selected={selected}
        style={style}
        activeOpacity={activeOpacity}
        onPress={onPress}
        disabled={disabled}
        onLongPress={onLongPress}
        onPressOut={onPressOut}>
        {text && (
          <ButtonText disabled={disabled} selected={selected} style={textStyle}>
            {text}
          </ButtonText>
        )}
        {children && children}
      </Button>
    );
  }
}

export default OwnButton;
