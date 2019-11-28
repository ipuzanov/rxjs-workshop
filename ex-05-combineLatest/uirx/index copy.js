const { fromEvent, combineLatest, Observable } = rxjs;
const { map, startWith, debounceTime, switchMap } = rxjs.operators;

const nameInput = document.getElementById('name');
const categoryInput = document.getElementById('category');
const inStockInput = document.getElementById('in-stock');

const name$ = fromEvent(nameInput, 'input').pipe(
  map(evt => evt.target.value),
  startWith(nameInput.value),
);
const category$ = fromEvent(categoryInput, 'change').pipe(
  map(evt => evt.target.value),
  startWith(categoryInput.value),
);
const inStock$ = fromEvent(inStockInput, 'change').pipe(
  map(evt => evt.target.checked),
  startWith(inStockInput.checked),
);

combineLatest(name$, category$, inStock$)
  .pipe(
    debounceTime(200),
    switchMap(
      ([name, category, inStock]) =>
        new Observable(subscriber => {
          const ctrl = new AbortController();
          fetch(`/api/search?name=${name}&category=${category}&inStock=${Number(inStock)}`, {
            signal: ctrl.signal,
          })
            .then(r => r.json())
            .then(r => subscriber.next(r));
          return () => ctrl.abort();
        }),
    ),
  )
  .subscribe(drawResult);
