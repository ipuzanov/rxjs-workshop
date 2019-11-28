import { useState, useEffect, useRef, useCallback } from 'react';

import set from 'lodash.set';
import get from 'lodash.get';
import clonedeep from 'lodash.clonedeep';

export default (initialState: any = {}) => {
  const [data, setData] = useState(initialState);

  const handler = useCallback(
    (path, value) => {
      if (get(data, path) !== value) {
        setData(set(clonedeep(data), path, value));
      }
    },
    [data],
  );

  return [data, handler];
};
