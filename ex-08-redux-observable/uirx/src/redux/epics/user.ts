import { ofType } from 'redux-observable';
import { FETCH_USER, UPDATE_USER } from '../constants/user';
import { of } from 'rxjs';
import { switchMap, map, pluck, mergeMap, catchError } from 'rxjs/operators';
import { getUserRequest, updateUserRequest } from '../../api/user';
import { setUser } from '../actions/user';
import { addNotification } from '../actions/notifications';

export const fetchUserEpic = action$ =>
  action$.pipe(
    ofType(FETCH_USER),
    switchMap(() => getUserRequest()),
    map(setUser),
  );

export const updateUserEpic = action$ =>
  action$.pipe(
    ofType(UPDATE_USER),
    pluck('payload'),
    mergeMap(update => updateUserRequest(update)),
    catchError(error => of({ error })),
    mergeMap((result: any) =>
      result.error
        ? [addNotification({ type: 'error', message: 'failed to update user' })]
        : [
            setUser(result),
            addNotification({ type: 'success', message: 'user updated successfully' }),
          ],
    ),
  );
