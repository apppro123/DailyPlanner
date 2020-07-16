import React from 'react';
import { FlatList, StyleSheet, FlatListProps } from 'react-native';
//own components
import { OwnView } from '../basicC';

function keyExtractor<T>(item: T, index: number): string { return index.toString() };

const renderItemSeperator = () => {
  return <OwnView style={styles.itemSeparatorComponent} />;
};

export function OverviewList<T>(props: FlatListProps<T>) {
  const { data, renderItem, extraData } = props;
  return (
    <FlatList
      keyExtractor={keyExtractor}
      data={data}
      extraData={extraData}
      renderItem={renderItem}
      ItemSeparatorComponent={renderItemSeperator}
    />
  );
};



const styles = StyleSheet.create({
  itemSeparatorComponent: {
    height: 2,
    backgroundColor: '#A4A4A4',
  },
});