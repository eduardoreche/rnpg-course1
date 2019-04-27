import { ADD_PLACE, DELETE_PLACE } from './actionTypes';

export const addPlace = (name, location, image) => dispatch => {
  fetch('https://us-central1-awesome-places-b54de.cloudfunctions.net/storeImage', {
    method: 'POST',
    body: JSON.stringify({ image: image.base64 })
  })
    .catch(err => console.log(err))
    .then(res => res.json())
    .then(parsedRes => {
      const placeData = {
        name,
        location,
        image: parsedRes.imageUrl
      };

      return fetch('https://awesome-places-b54de.firebaseio.com/places.json', {
        method: 'POST',
        body: JSON.stringify(placeData)
      })
        .catch(err => console.log(err))
        .then(res => res.json())
        .then(parsedRes => {
          console.log(parsedRes);
        });
    });
};

export const deletePlace = key => {
  return {
    type: DELETE_PLACE,
    payload: key
  };
};
