import { SET_USER } from '../constants/user';

const initialState = {
  name: '',
  email: '',
  phone: '',
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_USER:
      return { ...state, ...payload };
    default:
      return state;
  }
};
