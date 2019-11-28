const { fromEvent, merge, combineLatest, Observable, BehaviorSubject, Subject } = rxjs;
const {
  share,
  pluck,
  map,
  tap,
  mapTo,
  startWith,
  debounceTime,
  switchMap,
  distinct,
  repeatWhen,
  withLatestFrom,
  skip,
} = rxjs.operators;

const nameInput = document.getElementById('name');
const pageSizeInput = document.getElementById('pageSize');
const categoryInput = document.getElementById('category');
const inStockInput = document.getElementById('in-stock');
const prev = document.getElementById('page-prev');
const next = document.getElementById('page-next');
const pageOut = document.getElementById('page');

// setup filter stream
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
const filter$ = combineLatest(name$, category$, inStock$);

// setup pagination streams
const pageSize$ = fromEvent(pageSizeInput, 'change').pipe(
  map(evt => +evt.target.value),
  startWith(pageSizeInput.value),
);
const prevPage$ = fromEvent(prev, 'click').pipe(mapTo(-1));
const nextPage$ = fromEvent(next, 'click').pipe(mapTo(1));

const maxPage$ = new BehaviorSubject(1);
const page$ = new BehaviorSubject(0);

page$.subscribe(x => {
  pageOut.innerText = ++x;
});

// reset page num of filter and page size change
merge(filter$, pageSize$).subscribe(() => page$.next(0));

// setup page switching
merge(prevPage$, nextPage$)
  .pipe(
    withLatestFrom(page$, maxPage$),
    map(([diff, page, maxPage]) => (page + diff + maxPage) % maxPage),
  )
  .subscribe(page$);

// define data stream
const data$ = combineLatest(filter$, page$, pageSize$).pipe(
  debounceTime(200),
  switchMap(
    ([[name, category, inStock], page, pageSize]) =>
      new Observable(sub => {
        const ctrl = new AbortController();

        fetch(
          `/api/search?name=${name}&category=${category}&inStock=${Number(inStock)}&page=${page +
            1}&size=${pageSize}`,
          {
            signal: ctrl.signal,
          },
        )
          .then(r => r.json())
          .then(result => sub.next(result));

        return () => ctrl.abort();
      }),
  ),
  share(),
);

// use count property from backend to figure out page count
data$
  .pipe(
    pluck('count'),
    withLatestFrom(pageSize$),
    map(([count, pageSize]) => Math.ceil(count / pageSize)),
  )
  .subscribe(maxPage$);

// draw returned values
data$.pipe(pluck('data')).subscribe(drawResult);
