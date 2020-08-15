import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';
//own components
import {OwnView, OwnText, OwnButton, OwnIcon} from '../basicC';

const {width} = Dimensions.get('window');

interface Props {
  title: string,
  iconName?: string,
  showIcon?: boolean,
  onIconPress?: () => void,
}

export const SectionIconHeader =  ({
  onIconPress,
  title,
  iconName = 'plus',
}:Props) => {
  //icon name is by default "plus"
  return (
    <OwnView style={styles.container}>
      <OwnText text={title} style={styles.title} />
      {onIconPress && (
        <OwnButton onPress={onIconPress} style={styles.plusButton}>
          <OwnIcon iconSet="MaterialCommunity" name={iconName} size={35} />
        </OwnButton>
      )}
    </OwnView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width - 20 - 10,
    padding: 1,
    margin: 4,
    borderRadius: 5,
    flexDirection: 'row',
    height: 40,
  },
  plusButton: {
    position: 'absolute',
    right: 0,
  },
  title: {
    height: 40,
    fontSize: 25,
  },
});
