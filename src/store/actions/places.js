import { SET_PLACES } from './actionTypes';
import { uiStartLoading, uiStopLoading } from './index';

export const addPlace = (name, location, image) => dispatch => {
  dispatch(uiStartLoading());

  fetch('https://us-central1-awesome-places-b54de.cloudfunctions.net/storeImage', {
    method: 'POST',
    body: JSON.stringify({ image: image.base64 })
  })
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
        .then(res => res.json())
        .then(parsedRes => {
          console.log(parsedRes);
          dispatch(uiStopLoading());
        })
        .catch(err => {
          console.log(err);
          alert('Something went wrong, please try again!');
          dispatch(uiStopLoading());
        });
    })
    .catch(err => {
      alert('Something went wrong, please try again!');
      dispatch(uiStopLoading());
    });
};

export const getPlaces = () => {
  return dispatch => {
    fetch('https://awesome-places-b54de.firebaseio.com/places.json')
      .then(res => res.json())
      .then(parsedRes => {
        const places = [];
        for (let key in parsedRes) {
          places.push({
            ...parsedRes[key],
            image: {
              uri: parsedRes[key].image
            },
            id: key
          });
        }
        console.log(places);
        dispatch(setPlaces(places));
      })
      .catch(err => {
        alert('Something went wrong, please try again!');
        console.log(err);
      });
  };
};

export const setPlaces = places => {
  return {
    type: SET_PLACES,
    places: places
  };
};

export const deletePlace = key => {
  return {
    type: 'DELETE_PLACE',
    payload: key
  };
};
