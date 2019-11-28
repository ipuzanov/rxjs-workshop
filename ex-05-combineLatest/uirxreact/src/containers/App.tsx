import React, { useEffect, useState, useRef, useMemo, ChangeEvent } from 'react';
import { fromEvent, Observable, combineLatest } from 'rxjs';
import { map, switchMap, debounceTime, startWith } from 'rxjs/operators';

export default () => {
  const options = useMemo(() => ['A', 'B', 'C', 'D', 'E', 'G', 'H', 'I', 'J'], []);

  const nameInput = useRef(null);
  const categoryInput = useRef(null);
  const inStockInput = useRef(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const name$ = fromEvent(nameInput.current!, 'input').pipe(
      map((evt: any) => evt.target.value),
      startWith(''),
    );
    const category$ = fromEvent(categoryInput.current!, 'change').pipe(
      map((evt: any) => evt.target.value),
      startWith('A'),
    );
    const inStock$ = fromEvent(inStockInput.current!, 'change').pipe(
      map((evt: any) => evt.target.checked),
      startWith(false),
    );

    const sub = combineLatest(name$, category$, inStock$)
      .pipe(
        debounceTime(200),
        switchMap(
          ([name, category, inStock]) =>
            new Observable(sub => {
              const c = new AbortController();
              fetch(`/api/search?name=${name}&category=${category}&inStock=${Number(inStock)}`, {
                signal: c.signal,
              })
                .then(r => r.json())
                .then(x => sub.next(x));
              return () => c.abort();
            }),
        ),
      )
      .subscribe(setResults);

    return () => sub.unsubscribe();
  }, [nameInput.current, categoryInput.current, inStockInput.current]);

  return (
    <>
      <div>
        <label htmlFor="name">
          Search
          <input name="name" ref={nameInput} />
        </label>
        <label htmlFor="in-stock">
          In stock?
          <input name="in-stock" type="checkbox" ref={inStockInput} />
        </label>
        <label htmlFor="category">
          <select name="category" ref={categoryInput}>
            {options.map(opt => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>
      </div>
      <ul>
        {results.map((r, ix) => (
          <li key={ix}>{JSON.stringify(r)}</li>
        ))}
      </ul>
    </>
  );
};
