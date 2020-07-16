import React from 'react';
import { StyleSheet } from 'react-native';
//own components
import OwnText from './Text';
import OwnView from "./View";
import { withTheme } from 'styled-components/native';
//icons
import IconFeather from 'react-native-vector-icons/Feather';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconSimpleLine from 'react-native-vector-icons/SimpleLineIcons';
import IconOct from 'react-native-vector-icons/Octicons';
//interfaces
import { ThemeI } from "res";

interface Props {
  theme: ThemeI,
  name: string,
  size: number,
  iconSet: string,
  color?: string,
  selected?: boolean,
  style?: {},
  iconStyle?: {},
  label?: string,
  showLabel?: boolean
}

class OwnIcon extends React.PureComponent<Props> {
  
  render() {
    const {
      name,
      size, iconSet,
      color,
      selected,
      theme,
      style,
      iconStyle,
      label,
      showLabel = false,
    } = this.props;
    const colorProp = selected
      ? theme.colors.primary
      : color
        ? color
        : theme.colors.text;

    return (
      <OwnView style={styles.container}>
        {//which group of icons should be selected
          iconSet === 'Feather' ? (
            <IconFeather
              name={name}
              size={size}
              color={colorProp}
              style={style}
              iconStyle={iconStyle}
            />
          ) : iconSet === 'MaterialCommunity' ? (
            <IconMaterialCommunity
              name={name}
              size={size}
              color={colorProp}
              style={style}
              iconStyle={iconStyle}
            />
          ) : iconSet === 'Material' ? (
            <IconMaterial
              name={name}
              size={size}
              color={colorProp}
              style={style}
              iconStyle={iconStyle}
            />
          ) : iconSet === 'AntDesign' ? (
            <IconAntDesign
              name={name}
              size={size}
              color={colorProp}
              style={style}
              iconStyle={iconStyle}
            />
          ) : iconSet === 'Oct' ? (
            <IconOct
              name={name}
              size={size}
              color={colorProp}
              style={style}
              iconStyle={iconStyle}
            />
          ) : iconSet === 'Entypo' ? (
            <IconEntypo
              name={name}
              size={size}
              color={colorProp}
              style={style}
              iconStyle={iconStyle}
            />
          ) : (
                        iconSet === 'SimpleLine' && (
                          <IconSimpleLine
                            name={name}
                            size={size}
                            color={colorProp}
                            style={style}
                            iconStyle={iconStyle}
                          />
                        )
                      )}
        {//label of icon if necessary
          showLabel && (
            <OwnText style={styles.labelText} text={label ? label : name} />
          )}
      </OwnView>
    );
  }
}

const styles = StyleSheet.create({
  labelText: {
    fontSize: 10,
    paddingLeft: 0,
    paddingRight: 0,
    borderRadius: 0,
  },
  container: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

export default withTheme(OwnIcon);
