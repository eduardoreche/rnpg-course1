import { AUTH_SET_TOKEN, AUTH_REMOVE_TOKEN } from '../actions/actionTypes';

const initialState = {
  token: null,
  expiryDate: null
};

const reducer = (state = initialState, action) => {
  console.log(action, state);
  switch (action.type) {
    case AUTH_SET_TOKEN:
      return {
        ...state,
        token: action.token,
        expiryDate: action.expiryDate
      };
    case AUTH_REMOVE_TOKEN:
      console.log('remove token');
      return {
        ...state,
        token: null,
        expiryDate: null
      };
    default:
      return state;
  }
};

export default reducer;
