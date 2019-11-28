import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import NotificationItem from './NotificationItem';

import { addNotification } from '../redux/actions/notifications';

const NotificationWrapper = ({ items, push }) => {
  const tmp = items.slice().reverse();

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000/ws');
    ws.onmessage = evt => push(JSON.parse(evt.data));
  }, []);

  return (
    <div className="notification-wrapper">
      {tmp.map(item => (
        <NotificationItem key={item.id} item={item} />
      ))}
    </div>
  );
};

const mstp = ({ notifications: { items } }) => ({ items });
const mdtp = {
  push: addNotification,
};
export default connect(mstp, mdtp)(NotificationWrapper);
