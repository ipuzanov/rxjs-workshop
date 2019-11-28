const { fromEvent, combineLatest, Observable, BehaviorSubject } = rxjs;
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
const widthInput = document.getElementById('width');
const colorBtns = Array.prototype.slice.call(document.getElementsByClassName('color-btn'));

const rect = canvas.getBoundingClientRect();

const width$ = fromEvent(widthInput, 'change').pipe(
  map(evt => evt.target.value),
  startWith(widthInput.value),
);
const color$ = new BehaviorSubject('#0000FF');
colorBtns.forEach(btn =>
  fromEvent(btn, 'click')
    .pipe(mapTo(btn.style.color))
    .subscribe(color$),
);

const mousedown$ = fromEvent(canvas, 'mousedown');
const mouseup$ = fromEvent(canvas, 'mouseup');
const mousemove$ = fromEvent(canvas, 'mousemove').pipe(
  map(evt => ({ x: evt.pageX - rect.left, y: evt.pageY - rect.top })),
);

const path$ = mousemove$.pipe(
  skipUntil(mousedown$),
  takeUntil(mouseup$),
  scan((acc, p) => (Array.isArray(acc) ? [acc[1], p] : [acc, p])),
  repeat(),
  filter(x => x.length > 1),
);

// combineLatest(path$, width$, color$).subscribe(([[p1, p2], width, color]) => {
//   c2d.beginPath();
//   c2d.moveTo(p1.x, p1.y);
//   c2d.lineTo(p2.x, p2.y);
//   c2d.lineWidth = width * 2;
//   c2d.strokeStyle = color;
//   c2d.stroke();

//   c2d.beginPath();
//   c2d.arc(p1.x, p1.y, width, 0, 2 * Math.PI, false);
//   c2d.fillStyle = color;
//   c2d.fill();
// });

mousemove$
  .pipe(
    skipUntil(mousedown$),
    takeUntil(mouseup$),
    scan((acc, p) => (Array.isArray(acc) ? [acc[1], p] : [acc, p])),
    repeat(),
    filter(x => x.length > 1),
    withLatestFrom(width$, color$),
  )
  .subscribe(([[p1, p2], width, color]) => {
    c2d.beginPath();
    c2d.moveTo(p1.x, p1.y);
    c2d.lineTo(p2.x, p2.y);
    c2d.lineWidth = width * 2;
    c2d.strokeStyle = color;
    c2d.stroke();

    c2d.beginPath();
    c2d.arc(p1.x, p1.y, width, 0, 2 * Math.PI, false);
    c2d.fillStyle = color;
    c2d.fill();
  });
