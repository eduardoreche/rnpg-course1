import { ADD_PLACE, DELETE_PLACE } from './actionTypes';

export const addPlace = (name, location, image) => dispatch => {
  const placeData = {
    name,
    location
  };

  fetch('https://awesome-places-b54de.firebaseio.com/places.json', {
    method: 'POST',
    body: JSON.stringify(placeData)
  })
    .catch(err => console.log(err))
    .then(res => res.json())
    .then(parsedRes => {
      console.log(parsedRes);
    });
};

export const deletePlace = key => {
  return {
    type: DELETE_PLACE,
    payload: key
  };
};
