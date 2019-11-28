import { SET_USER, FETCH_USER, UPDATE_USER } from '../constants/user';

export const setUser = newUser => ({ type: SET_USER, payload: newUser });

export const updateUser = update => ({ type: UPDATE_USER, payload: update });

export const fetchUser = () => ({ type: FETCH_USER });
