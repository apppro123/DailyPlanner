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
      iconSet,
      selected,
      theme,
      color,
      label,
      showLabel = false,
      ...props
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
              color={colorProp}
              {...props}
            />
          ) : iconSet === 'MaterialCommunity' ? (
            <IconMaterialCommunity
              color={colorProp}
              {...props}
            />
          ) : iconSet === 'Material' ? (
            <IconMaterial
              color={colorProp}
              {...props}
            />
          ) : iconSet === 'AntDesign' ? (
            <IconAntDesign
              color={colorProp}
              {...props}
            />
          ) : iconSet === 'Oct' ? (
            <IconOct
              color={colorProp}
              {...props}
            />
          ) : iconSet === 'Entypo' ? (
            <IconEntypo
              color={colorProp}
              {...props}
            />
          ) : (
                        iconSet === 'SimpleLine' && (
                          <IconSimpleLine
                            color={colorProp}
                            {...props}
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
