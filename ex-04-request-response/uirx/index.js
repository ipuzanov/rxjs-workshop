const { of } = rxjs;
const { webSocket } = rxjs.webSocket;
const { retryWhen, delay, tap, pluck, first, take, mergeMap, map, filter } = rxjs.operators;

const createWsConnection = url => {
  const input$ = webSocket(url);
  const output$ = input$.pipe(
    retryWhen(error$ =>
      error$.pipe(
        tap(err => console.log(err)),
        delay(1000),
      ),
    ),
  );

  return { input$, output$ };
};

const topic = topicName => filter(msg => msg.topic === topicName);
const buildReqResMessage = payload => ({
  topic: 'request',
  message: {
    replyTo: 'response',
    correlationId: `m_${Math.ceil(Math.random() * 1000000)}`,
    payload,
  },
});

const ws = createWsConnection('ws://localhost:3000/ws');

const sendRequest = (payload, wsc) => {
  return of(payload).pipe(
    map(buildReqResMessage),
    tap(msg => wsc.input$.next(msg)),
    mergeMap(msg =>
      wsc.output$.pipe(
        topic('response'),
        first(m => m.message.correlationId === msg.message.correlationId),
        pluck('message'),
      ),
    ),
  );
};

sendRequest('ping', ws).subscribe({
  next: res => console.log('result: ', res),
  error: err => console.error('error: ', err),
  complete: () => console.log('complete'),
});
