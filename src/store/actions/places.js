import { ADD_PLACE, DELETE_PLACE } from './actionTypes';

export const addPlace = (name, location, image) => {
  return {
    type: ADD_PLACE,
    name,
    location,
    image
  };
};

export const deletePlace = key => {
  return {
    type: DELETE_PLACE,
    payload: key
  };
};
