import React, { useEffect, useState, useRef } from 'react';
import { fromEvent, Observable } from 'rxjs';
import { map, switchMap, debounceTime } from 'rxjs/operators';

export default () => {
  const input = useRef(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const sub = fromEvent(input.current!, 'input')
      .pipe(
        map((evt: any) => evt.target.value),
        debounceTime(200),
        switchMap(
          x =>
            new Observable(sub => {
              const c = new AbortController();
              fetch(`/api/search?search=${x}`, { signal: c.signal })
                .then(r => r.json())
                .then(x => sub.next(x));
              return () => c.abort();
            }),
        ),
      )
      .subscribe((v: any) => setResults(v));
    return () => sub.unsubscribe();
  }, [input.current]);

  return (
    <>
      <input ref={input} />
      <ul>
        {results.map((r, ix) => (
          <li key={ix}>{r}</li>
        ))}
      </ul>
    </>
  );
};
