import { SET_USER } from '../constants/user';
import { updateUserRequest, getUserRequest } from '../../api/user';
import { addNotification } from './notifications';

export const setUser = newUser => ({ type: SET_USER, payload: newUser });

export const updateUser = update => dispatch =>
  updateUserRequest(update)
    .then(result => {
      dispatch(setUser(result));
      dispatch(addNotification({ type: 'success', message: 'user updated successfully' }));
    })
    .catch(err => {
      console.error(err);
      dispatch(
        addNotification({ type: 'error', message: `Failed to update user: ${err.message}` }),
      );
    });

export const fetchUser = () => dispatch =>
  getUserRequest().then(result => {
    dispatch(setUser(result));
  });
