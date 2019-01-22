import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const listItem = ({ placeName, onItemPressed }) => (
  <TouchableOpacity onPress={onItemPressed}>
    <View style={styles.listItem}>
      <Text>{placeName}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  listItem: {
    width: '100%',
    marginBottom: 10,
    padding: 20,
    backgroundColor: '#eee'
  }
});

export default listItem;
