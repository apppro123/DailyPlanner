import React from 'react';
import { SectionList, StyleSheet, SectionListProps } from 'react-native';
//own components
import { OwnText, OwnView } from '../basicC';

function keyExtractor<T>(item: T, index: number): string { return index.toString() };

const renderItemSeperator = () => {
  return <OwnView style={styles.itemSeparatorComponent} />;
};

const renderSectionHeader = ({ section }) => (
  <OwnText text={section.title} />
)

export function OverviewSectionList<T>(props: SectionListProps<T>) {
  const { sections, renderItem, extraData, onRefresh, refreshing } = props;
  return (
    <SectionList
      renderSectionHeader={renderSectionHeader}
      sections={sections}
      keyExtractor={keyExtractor}
      extraData={extraData}
      renderItem={renderItem}
      ItemSeparatorComponent={renderItemSeperator}
      onRefresh={onRefresh}
      refreshing={refreshing}
    />
  );
};



const styles = StyleSheet.create({
  itemSeparatorComponent: {
    height: 2,
    backgroundColor: '#A4A4A4',
  },
});