const { Subject } = rxjs;
const { webSocket } = rxjs.webSocket;
const { retryWhen, delay, tap, mergeMap, share, startWith } = rxjs.operators;

const createWsConnection = url =>
  webSocket(url).pipe(
    retryWhen(error$ =>
      error$.pipe(
        tap(err => console.log(err)),
        delay(1000),
      ),
    ),
  );

const ws = createWsConnection('ws://localhost:3000/ws');

const sub = ws.subscribe(msg => console.log(msg));
