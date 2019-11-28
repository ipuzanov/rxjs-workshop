import React from 'react';

import App from './containers/App';
import { Provider } from 'react-redux';

import store from './redux';
import NotificationWrapper from './components/NotificationWrapper';

export default () => (
  <Provider store={store}>
    <NotificationWrapper />
    <App />
  </Provider>
);
