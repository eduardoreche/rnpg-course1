import { ADD_PLACE, DELETE_PLACE } from '../actions/actionTypes';

const initialState = {
  places: [
    {
      key: Math.random().toString(),
      name: 'Munich',
      image: {
        uri:
          'https://cache-graphicslib.viator.com/graphicslib/thumbs674x446/2630/SITours/cruzeiro-de-ponte-a-ponte-de-san-francisco-in-san-francisco-131321.jpg'
      }
    }
  ]
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PLACE:
      return {
        ...state,
        places: state.places.concat({
          key: Math.random().toString(),
          name: action.name,
          location: action.location,
          image: {
            uri: action.image.uri
          }
        })
      };
    case DELETE_PLACE:
      return {
        ...state,
        places: state.places.filter(place => place.key !== action.payload),
        selectedPlace: null
      };
    default:
      return state;
  }
};

export default reducer;
