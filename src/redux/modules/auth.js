const LOAD = 'auth/LOAD';
const LOAD_SUCCESS = 'auth/LOAD_SUCCESS';
const LOAD_FAIL = 'auth/LOAD_FAIL';
const LOGIN = 'auth/LOGIN';
const LOGIN_SUCCESS = 'auth/LOGIN_SUCCESS';
const LOGIN_FAIL = 'auth/LOGIN_FAIL';
const LOGOUT = 'auth/LOGOUT';
const LOGOUT_SUCCESS = 'auth/LOGOUT_SUCCESS';
const LOGOUT_FAIL = 'auth/LOGOUT_FAIL';
const SET_USER_FROM_LOCAL = 'auth/SET_USER_FROM_LOCAL'; // localStorage
const AUTH_REDIRECTED = 'auth/AUTH_REDIRECTED';
const LOGIN_RENDERED = 'auth/LOGIN_RENDERED';
const API_ERROR = 'auth/API_ERROR'; // to verify if is auth error

import Accounts from '../../helpers/Accounts';
import {routeActions} from 'redux-simple-router';
const {LOGIN_PATH} = Accounts;

const initialState = {
  user: Accounts.sessionUser(),
  loaded: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case AUTH_REDIRECTED:
      return {
        ...state,
        lastRouteLocation: action.nextState.location
      };
    case SET_USER_FROM_LOCAL:
      return {
        ...state,
        loggingIn: false,
        loginError: false,
        user: {...action.localUser, fromLocal: true}
      };
    case LOGIN:
      return {
        ...state,
        loggingIn: true
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        loginError: false,
        user: Accounts.formatUserData(action.result)
      };
    case LOGIN_FAIL:
      return {
        ...state,
        loggingIn: false,
        user: null,
        loginError: action.error,
        error: false
      };
    case LOGOUT:
      return {
        ...state,
        loggingOut: true
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggingOut: false,
        user: null
      };
    case LOGOUT_FAIL:
      return {
        ...state,
        loggingOut: false,
        logoutError: action.error
      };
    default:
      return state;
  }
}

export function load() { // load (previous) session in server
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/loadAuth')
  };
}

export function login(username, password) {
  const data = {username, password};
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: (client) => client.post(LOGIN_PATH, {data})
  };
}

export function logout() {
  return (dispatch) => {
    Accounts.removeLocalStorageUser();
    dispatch(LOGOUT_SUCCESS);
  };
}

export function authRedirected(nextState = {}) {
  return {
    type: AUTH_REDIRECTED,
    nextState
  };
}

export function setUserFromLocal(localUser) {
  return {
    type: SET_USER_FROM_LOCAL,
    localUser
  };
}

// nextState is intended route
export function requireAuth(nextState = {}) {
  return (dispatch) => {
    const localUser = Accounts.sessionUser();

    if (!localUser) {
      dispatch(routeActions.replace('/login'));
      dispatch(authRedirected(nextState));
    } else {
      dispatch(setUserFromLocal(localUser));
    }
  };
}

export function loginRendered() {
  return {
    type: LOGIN_RENDERED
  };
}

export function authHandleAPIError(error, afterOrBefore) {
  return {
    type: API_ERROR,
    error,
    afterOrBefore
  };
}
