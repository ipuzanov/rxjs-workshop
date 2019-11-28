const { from, concat, throwError } = rxjs;
const { retryWhen, delay, tap, take, mergeMap } = rxjs.operators;

const retryableFetch = (url, options, retryCount = 3) =>
  from(fetch(url, options).then(r => r.json())).pipe(
    retryWhen(error$ =>
      concat(
        error$.pipe(delay(1000), take(retryCount)),
        error$.pipe(
          take(1),
          mergeMap(err => throwError(err)),
        ),
      ),
    ),
  );

retryableFetch('http://www.mocky.io/v2/5dda53c63100005300605dd').subscribe({
  next: result => console.log('result:', result),
  error: err => console.log('error: ', err),
  complete: () => console.log('complete'),
});
