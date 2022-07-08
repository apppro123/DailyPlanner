import React from 'react';
import {Platform} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {PickerProps} from '@react-native-picker/picker';
import styled, {useTheme} from 'styled-components/native';
//own components
import OwnView from './View';
import OwnIcon from './Icon';
//interfaces
import {ThemeI} from 'res';

interface ArrowContainerProps {
  style: {height: number; [key: string]: any};
}

interface OwnPickerProps<T> extends PickerProps<T> {
  containerStyle: {};
  children: any;
}

const Container = styled(props => <OwnView {...props} />)`
  border-radius: 15px;
`;
//arrow when theme is dark (and i cannot set color for arrow (arrow is black by default...))
const ArrowContainer = styled(props => (
  <OwnView {...props} />
))<ArrowContainerProps>`
  position: absolute;
  right: 30px;
  top: ${props => (props.style.height ? props.style.height / 2 - 10 : 15)}px;
`;

const StyledPicker = styled(Picker).attrs<{theme: ThemeI}>(({theme}) => ({
  itemStyle: {
    height: 50,
  },
  height: 50,
  color: theme.colors.text,
  borderColor: theme.colors.border,
  backgroundColor: theme.colors.background,
}))<{theme: ThemeI}>`
  color: ${({theme}) => theme.colors.text};
  border-color: ${({theme}) => theme.colors.border};
  background-color: ${({theme}) => theme.colors.background};
  border-radius: 10px;
  padding-left: 7px;
  padding-right: 7px;
`;

const DIALOG = 'dialog';

const OwnPicker = <T,>(props: OwnPickerProps<T>) => {
  const {
    children,
    onValueChange,
    selectedValue,
    containerStyle,
    style = {},
    itemStyle = {},
  } = props;
  const theme: ThemeI = useTheme();
  return (
    <Container style={containerStyle}>
      {Platform.OS === 'android' && theme.dark && (
        <ArrowContainer>
          <OwnIcon iconSet="AntDesign" name="caretdown" size={20} />
        </ArrowContainer>
      )}
      <StyledPicker
        selectedValue={selectedValue}
        mode={DIALOG}
        style={style}
        onValueChange={onValueChange}
        itemStyle={itemStyle}>
        {children}
      </StyledPicker>
    </Container>
  );
};

export default OwnPicker;
