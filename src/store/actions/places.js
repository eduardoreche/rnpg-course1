import { SET_PLACES, REMOVE_PLACE, PLACE_ADDED, START_ADD_PLACE } from './actionTypes';
import { uiStartLoading, uiStopLoading, authGetToken } from './index';

export const startAddPlace = () => {
  return {
    type: START_ADD_PLACE
  };
};

export const addPlace = (name, location, image) => dispatch => {
  dispatch(uiStartLoading());
  dispatch(startAddPlace());
  let authToken;

  dispatch(authGetToken())
    .then(token => {
      authToken = token;
      fetch(`https://us-central1-awesome-places-b54de.cloudfunctions.net/storeImage`, {
        method: 'POST',
        body: JSON.stringify({ image: image.base64 }),
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => {
          if (res.ok) return res.json();
          else throw new Error();
        })
        .then(parsedRes => {
          fetch(`https://awesome-places-b54de.firebaseio.com/places.json?auth=${authToken}`, {
            method: 'POST',
            body: JSON.stringify({
              name,
              location,
              image: parsedRes.imageUrl,
              imagePath: parsedRes.imagePath
            })
          })
            .then(res => {
              if (res.ok) return res.json();
              else throw new Error();
            })
            .then(parsedRes => {
              console.log(parsedRes);
              dispatch(uiStopLoading());
              dispatch(placeAdded());
            })
            .catch(err => {
              console.log(err);
              alert('Error when try to save the place');
              dispatch(uiStopLoading());
            });
        })
        .catch(err => {
          alert('Error when try to store the image');
          console.log(err);
          dispatch(uiStopLoading());
        });
    })
    .catch(() => {
      alert('No valid token found!');
      dispatch(uiStopLoading());
    });
};

export const placeAdded = () => {
  return {
    type: PLACE_ADDED
  };
};

export const getPlaces = () => {
  return dispatch => {
    dispatch(authGetToken())
      .then(token => {
        fetch(`https://awesome-places-b54de.firebaseio.com/places.json?auth=${token}`)
          .then(res => {
            if (res.ok) return res.json();
            else throw new Error();
          })
          .then(parsedRes => {
            const places = [];
            for (let key in parsedRes) {
              places.push({
                ...parsedRes[key],
                image: {
                  uri: parsedRes[key].image
                },
                key: key
              });
            }
            console.log(places);
            dispatch(setPlaces(places));
          })
          .catch(err => {
            alert('Something went wrong, please try again!');
            console.log(err);
          });
      })
      .catch(() => alert('No valid token found!'));
  };
};

export const setPlaces = places => {
  return {
    type: SET_PLACES,
    places: places
  };
};

export const deletePlace = key => dispatch => {
  dispatch(authGetToken())
    .then(token => {
      dispatch(removePlace(key));

      return fetch(`https://awesome-places-b54de.firebaseio.com/places/${key}.json?auth=${token}`, {
        method: 'DELETE'
      })
        .then(res => {
          if (res.ok) return res.json();
          else throw new Error();
        })
        .catch(err => {
          alert('Something went wrong, please try again!');
          console.log(err);
        });
    })

    .catch(() => alert('No valid token found!'));
};

export const removePlace = key => {
  return {
    type: REMOVE_PLACE,
    key
  };
};
