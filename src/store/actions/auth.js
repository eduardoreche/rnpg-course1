import { AsyncStorage } from 'react-native';
import { TRY_AUTH, AUTH_SET_TOKEN, AUTH_REMOVE_TOKEN } from './actionTypes';
import { uiStartLoading, uiStopLoading } from './index';
import startMainTabs from '../../screens/MainTabs/startMainTabs';
import { FIREBASE_KEY } from '../../config';
import App from '../../../App';

export const tryAuth = (authData, authMode) => {
  return dispatch => {
    dispatch(uiStartLoading());

    let url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${FIREBASE_KEY}`;

    if (authMode === 'signup')
      url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${FIREBASE_KEY}`;

    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.ok) return res.json();
        else throw new Error();
      })
      .then(parsedRes => {
        dispatch(uiStopLoading());
        if (!parsedRes.idToken) {
          alert('Authentication failed, please try again');
        } else {
          dispatch(authStoreToken(parsedRes.idToken, parsedRes.expiresIn, parsedRes.refreshToken));
          startMainTabs();
        }
      })
      .catch(error => {
        console.log('test', error);
        alert('Authentication failed, please try again');
        dispatch(uiStopLoading());
      });
  };
};

export const authStoreToken = (token, expiresIn, refreshToken) => {
  return dispatch => {
    const now = new Date();
    const expiryDate = now.getTime() + expiresIn * 1000;
    dispatch(authSetToken(token, expiryDate));

    AsyncStorage.setItem('ap:auth:token', token);
    AsyncStorage.setItem('ap:auth:expiryDate', expiryDate.toString());
    AsyncStorage.setItem('ap:auth:refreshToken', refreshToken);
  };
};

export const authSetToken = (token, expiryDate) => {
  return {
    type: AUTH_SET_TOKEN,
    token,
    expiryDate
  };
};

export const authGetToken = () => (dispatch, getState) => {
  const promise = new Promise(async (resolve, reject) => {
    const token = getState().auth.token;
    const expiryDate = getState().auth.expiryDate;
    if (!token || new Date(expiryDate) <= new Date()) {
      let fetchedToken;
      try {
        const tokenFromStorage = await AsyncStorage.getItem('ap:auth:token');
        fetchedToken = tokenFromStorage;

        if (!tokenFromStorage) {
          console.log('no-token2');
          reject();
        } else {
          const expiryDate = await AsyncStorage.getItem('ap:auth:expiryDate');
          const parsedExpiryDate = new Date(parseInt(expiryDate));
          const now = new Date();

          if (parsedExpiryDate > now) {
            dispatch(authSetToken(fetchedToken));
            resolve(fetchedToken);
          } else {
            reject();
          }
        }
      } catch (err) {
        reject();
      }
    } else {
      resolve(token);
    }
  });

  return promise
    .catch(async err => {
      const refreshToken = await AsyncStorage.getItem('ap:auth:refreshToken');
      fetch(`https://securetoken.googleapis.com/v1/token?key=${FIREBASE_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `grant_type=refresh_token&refresh_token=${refreshToken}`
      })
        .then(res => {
          if (res.ok) return res.json();
          else throw new Error();
        })
        .then(parsedRes => {
          if (parsedRes.id_token) {
            console.log('Refresh token worked!');
            dispatch(authStoreToken(parsedRes.id_token, parsedRes.expires_in, parsedRes.refresh_token));

            return parsedRes.id_token;
          } else {
            dispatch(authClearStorage());
          }
        });

      return refreshToken;
    })
    .then(token => {
      if (!token) {
        throw new Error();
      } else {
        return token;
      }
    });
};

export const authAutoSign = () => {
  return async dispatch => {
    try {
      await dispatch(authGetToken());
      startMainTabs();
    } catch (err) {
      err => console.log('ERROR', err);
    }
  };
};

export const authClearStorage = () => {
  return dispatch => {
    AsyncStorage.removeItem('ap:auth:token');
    AsyncStorage.removeItem('ap:auth:expiryDate');
    return AsyncStorage.removeItem('ap:auth:refreshToken');
  };
};

export const authLogout = () => {
  return dispatch => {
    dispatch(authClearStorage()).then(async () => {
      const token = await AsyncStorage.getItem('ap:auth:token');
      console.log('TOKEN', token);
      App();
    });
    dispatch(authRemoveToken());
  };
};

export const authRemoveToken = () => {
  return {
    type: AUTH_REMOVE_TOKEN
  };
};
