import React from 'react';
import { FlatList, StyleSheet } from 'react-native';

import ListItem from '../ListItem/ListItem';

const placeList = ({ places, onItemSelected }) => (
  <FlatList
    style={styles.listContainer}
    data={places}
    renderItem={info => (
      <ListItem
        placeName={info.item.name}
        placeImage={info.item.image}
        onItemPressed={() => onItemSelected(info.item.key)}
      />
    )}
  />
);

const styles = StyleSheet.create({
  listContainer: {
    width: '100%'
  }
});

export default placeList;
