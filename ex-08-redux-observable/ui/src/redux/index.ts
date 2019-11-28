import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import user from './reducers/user';
import notifications from './reducers/notifications';

const rootReducer = combineReducers({
  user,
  notifications,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
