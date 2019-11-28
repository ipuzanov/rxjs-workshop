import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const s = new Subject();

s.pipe(
  switchMap(x =>
    new Promise(resolve => setTimeout(() => resolve(x), Math.random() * 2000))
  ),
).subscribe(x => console.log(x));
