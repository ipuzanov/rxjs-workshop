import React from 'react';
import { connect } from 'react-redux';

import { removeNotification } from '../redux/actions/notifications';

const NotificationItem = ({ item, remove }: any) => (
  <button className={`notification-item ${item.type}`} onClick={() => remove(item.id)}>
    {item.message}
  </button>
);

const mdtp = {
  remove: removeNotification,
};
export default connect(null, mdtp)(NotificationItem);
