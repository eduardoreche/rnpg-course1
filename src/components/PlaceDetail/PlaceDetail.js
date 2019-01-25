import React from 'react';
import { Modal, View, Image, Text, Button, StyleSheet } from 'react-native';

const placeDetail = ({ selectedPlace, onItemDeleted, onModalClosed }) => {
  let modalContent = null;

  if (selectedPlace) {
    const { name, image } = selectedPlace;
    modalContent = (
      <View>
        <Image source={image} style={styles.placeImage} />
        <Text style={styles.placeName}>{name}</Text>
      </View>
    );
  }

  return (
    <Modal
      onRequestClose={onModalClosed}
      visible={selectedPlace !== null}
      animationType="slide"
    >
      <View style={styles.modalContainer}>
        {modalContent}
        <View>
          <Button title="Delete" color="red" onPress={onItemDeleted} />
          <Button title="Close" onPress={onModalClosed} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    margin: 22
  },
  placeImage: {
    width: '100%',
    height: 200
  },
  placeName: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 28
  }
});

export default placeDetail;
