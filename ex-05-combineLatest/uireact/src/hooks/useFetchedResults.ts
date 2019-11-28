import { useState, useEffect, useRef } from 'react';

export default ([name, category, inStock]) => {
  const timer = useRef(null);
  const ctrl = useRef(new AbortController());

  const [results, setResults] = useState([]);

  useEffect(() => {
    clearTimeout(timer.current);
    ctrl.current.abort();
    ctrl.current = new AbortController();
    timer.current = setTimeout(
      () =>
        fetch(`/api/search?name=${name}&category=${category}&inStock=${Number(inStock)}`, {
          signal: ctrl.current.signal,
        })
          .then(r => r.json())
          .then(setResults)
          .catch(err => {
            console.error(err);

            setResults([]);
          }),
      200,
    );
  }, [name, category, inStock]);

  return results;
};
