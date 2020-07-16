import React from 'react';
import { TextInputProps } from "react-native";
import styled, { withTheme } from 'styled-components/native';
import { ThemeI } from 'res';

interface TextInputContainerProps{
  theme: ThemeI,
  falseInput?: boolean,
}

interface Props extends TextInputProps{
  theme: ThemeI,
  containerStyle?: {},
  falseInput?: boolean,
}

const StyledTextInput = styled.TextInput.attrs<{theme: ThemeI}>(({theme}) => ({
  underlineColorAndroid: theme.colors.border,
  placeholderTextColor: theme.colors.text,
})) <{theme: ThemeI}>`
  border-radius: 10px;
  padding-left: 7px;
  padding-right: 7px;
  color: ${({theme}) => theme.colors.primary};
  background-color: ${({theme}) => theme.colors.background};
  border-color: ${({theme}) => theme.colors.border};
`;

const StyledTextInputContainer = styled.View<TextInputContainerProps>`
  margin-top: 10px;
  border-width: 2px;
  border-color: ${props => props.falseInput ? props.theme.colors.falseInput : props.theme.colors.border};
  border-radius: 10px;
`;



class OwnTextInput extends React.Component<Props> {
  shouldComponentUpdate(nextProps) {
    const { value, theme } = this.props;
    if (value !== nextProps.value) {
      return true;
    } else if (theme.colors.primary !== nextProps.theme.colors.primary) {
      return true;
    }
    return false
  }
  render() {
    const { containerStyle,
      falseInput,
      ...textInputProps } = this.props;
    return (
      <StyledTextInputContainer
        style={containerStyle}
        falseInput={falseInput}>
        <StyledTextInput
          {...textInputProps}
        />
      </StyledTextInputContainer>
    )
  }
};

export default withTheme(OwnTextInput);
