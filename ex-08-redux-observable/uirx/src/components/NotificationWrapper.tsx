import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import NotificationItem from './NotificationItem';

const NotificationWrapper = ({ items }) => {
  const tmp = items.slice().reverse();
  return (
    <div className="notification-wrapper">
      {tmp.map(item => (
        <NotificationItem key={item.id} item={item} />
      ))}
    </div>
  );
};

const mstp = ({ notifications: { items } }) => ({ items });
export default connect(mstp)(NotificationWrapper);
