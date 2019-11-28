import { ADD_NOTIFICATION, REMOVE_NOTIFICATION } from '../constants/notifications';

const initialState = {
  items: [],
};

let nId = 0;

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_NOTIFICATION:
      return { ...state, items: state.items.concat({ ...payload, id: nId++ }) };
    case REMOVE_NOTIFICATION:
      return { ...state, items: state.items.filter(({ id }) => id !== payload) };
    default:
      return state;
  }
};
