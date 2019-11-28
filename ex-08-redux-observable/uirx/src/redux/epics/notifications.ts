import { webSocket } from 'rxjs/webSocket';
import { map, retryWhen } from 'rxjs/operators';
import { addNotification } from '../actions/notifications';

export const webSocketNotificationsEpic = () =>
  webSocket('ws://localhost:3000/ws').pipe(
    retryWhen(err$ => err$),
    map(addNotification),
  );
