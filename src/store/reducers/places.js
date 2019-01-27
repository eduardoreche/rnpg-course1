import { ADD_PLACE, DELETE_PLACE } from '../actions/actionTypes';

const initialState = {
  places: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PLACE:
      return {
        ...state,
        places: state.places.concat({
          key: Math.random().toString(),
          name: action.payload,
          image: {
            uri:
              'https://cache-graphicslib.viator.com/graphicslib/thumbs674x446/2630/SITours/cruzeiro-de-ponte-a-ponte-de-san-francisco-in-san-francisco-131321.jpg'
          }
        })
      };
    case DELETE_PLACE:
      return {
        ...state,
        places: state.places.filter(
          place => place.key !== state.selectedPlace.key
        ),
        selectedPlace: null
      };
    default:
      return state;
  }
};

export default reducer;
