import { ADD_PLACE, DELETE_PLACE } from './actionTypes';

export const addPlace = (name, location) => {
  return {
    type: ADD_PLACE,
    name,
    location
  };
};

export const deletePlace = key => {
  return {
    type: DELETE_PLACE,
    payload: key
  };
};
