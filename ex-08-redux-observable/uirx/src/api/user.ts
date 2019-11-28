export const getUserRequest = () => fetch('/api/user').then(r => r.json());
export const updateUserRequest = update =>
  fetch('/api/user', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(update),
  }).then(r => r.json());
