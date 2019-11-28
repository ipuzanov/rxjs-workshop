import React, { useRef, useEffect, useState } from 'react';

export default () => {
  const timer = useRef(null);
  const ctrl = useRef(new AbortController());

  const [value, setValue] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    clearTimeout(timer.current);
    ctrl.current.abort();
    ctrl.current = new AbortController();
    timer.current = setTimeout(
      () =>
        fetch(`/api/search?search=${value}`, { signal: ctrl.current.signal })
          .then(r => r.json())
          .then(setResults)
          .catch(err => {
            console.error(err);

            setResults([]);
          }),
      200,
    );
  }, [value]);

  return (
    <>
      <input value={value} onChange={evt => setValue(evt.target.value)} />
      <ul>
        {results.map((r: any, ix: any) => (
          <li key={ix}>{r}</li>
        ))}
      </ul>
    </>
  );
};
