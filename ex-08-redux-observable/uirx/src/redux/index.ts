import { combineReducers, applyMiddleware, createStore } from 'redux';
import { createEpicMiddleware, combineEpics } from 'redux-observable';

import user from './reducers/user';
import notifications from './reducers/notifications';

import { webSocketNotificationsEpic } from './epics/notifications';
import { fetchUserEpic, updateUserEpic } from './epics/user';

const epicMiddleware = createEpicMiddleware();

const rootEpic = combineEpics(webSocketNotificationsEpic, fetchUserEpic, updateUserEpic);

const rootReducer = combineReducers({
  user,
  notifications,
});

const store = createStore(rootReducer, applyMiddleware(epicMiddleware));

epicMiddleware.run(rootEpic);

export default store;
