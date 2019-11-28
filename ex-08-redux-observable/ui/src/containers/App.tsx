import React, { useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import useFormData from '../hooks/useFormData';

import * as userActions from '../redux/actions/user';

const App = ({ user, fetchUser, updateUser }) => {
  const [data, handler, setData] = useFormData(user);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    setData(user);
  }, [user]);

  const handleSave = useCallback(() => updateUser(data), [data]);

  return (
    <>
      <div>
        <label htmlFor="name">
          Name:
          <input
            name="name"
            value={data.name}
            onChange={evt => handler('name', evt.target.value)}
          />
        </label>
      </div>
      <div>
        <label htmlFor="email">
          Email:
          <input
            name="email"
            value={data.email}
            onChange={evt => handler('email', evt.target.value)}
          />
        </label>
      </div>
      <div>
        <label htmlFor="phone">
          Phone:
          <input
            name="phone"
            value={data.phone}
            onChange={evt => handler('phone', evt.target.value)}
          />
        </label>
      </div>
      <div>
        <button onClick={handleSave}>Save</button>
      </div>
    </>
  );
};

const mstp = ({ user }) => ({ user });
const mdtp = {
  fetchUser: userActions.fetchUser,
  updateUser: userActions.updateUser,
};

export default connect(mstp, mdtp)(App);
