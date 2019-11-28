const {
  fromEvent,
  merge,
  Observable,
  BehaviorSubject,
  animationFrameScheduler,
  asapScheduler,
} = rxjs;
const {
  map,
  startWith,
  mapTo,
  skipUntil,
  takeUntil,
  repeat,
  scan,
  filter,
  withLatestFrom,
} = rxjs.operators;

const canvas = document.getElementById('canvas');
const c2d = canvas.getContext('2d');
const rect = canvas.getBoundingClientRect();

function drawCircle(p) {
  c2d.clearRect(0, 0, canvas.width, canvas.height);

  c2d.beginPath();
  c2d.arc(p.x, p.y, 10, 0, 2 * Math.PI, false);
  c2d.fillStyle = 'red';
  c2d.fill();
}

const step = 10;

const keydown$ = fromEvent(document, 'keydown');
const up$ = keydown$.pipe(
  filter(evt => evt.keyCode === 38),
  mapTo({ x: 0, y: -step }),
);
const down$ = keydown$.pipe(
  filter(evt => evt.keyCode === 40),
  mapTo({ x: 0, y: step }),
);
const left$ = keydown$.pipe(
  filter(evt => evt.keyCode === 37),
  mapTo({ x: -step, y: 0 }),
);
const right$ = keydown$.pipe(
  filter(evt => evt.keyCode === 39),
  mapTo({ x: step, y: 0 }),
);

const point$ = new BehaviorSubject({ x: canvas.width / 2, y: canvas.height / 2 });

point$.subscribe(drawCircle);

merge(up$, left$, right$, down$)
  .pipe(
    withLatestFrom(point$),
    map(([diff, p]) => ({ x: p.x + diff.x, y: p.y + diff.y })),
  )
  .subscribe(point$);
