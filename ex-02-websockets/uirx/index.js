const { Subject } = rxjs;
const { webSocket } = rxjs.webSocket;
const { retryWhen, delay, tap, mergeMap, share, startWith } = rxjs.operators;

const createWsConnection = url => webSocket(url).pipe(retryWhen(err$ => err$.pipe(delay(200))));

const sub = new Subject();

const ws = sub.pipe(
  startWith('ws://localhost:3000/ws'),
  mergeMap(createWsConnection),
  share()
);

ws
  .pipe(filter(({ topic }) => topic === 'news')).subscribe(x => console.log(x));
