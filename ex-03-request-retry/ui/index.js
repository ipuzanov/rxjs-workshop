const retryableRequest = (url, options, retryCount = 3, retryNumber = 1) => {
  let timer;
  return fetch(url, options)
    .then(r => r.json())
    .catch(err => {
      console.error(err);
      if (retryNumber <= retryCount) {
        clearTimeout(timer);
        return new Promise(resolve => setTimeout(resolve, 1000)).then(() =>
          retryableRequest(url, options, retryCount, ++retryNumber),
        );
      }
      return Promise.reject(err);
    });
};
retryableRequest('http://www.mocky.io/v2/5dda53c63100005300605ddc', {}).then(result =>
  console.log('result:', result),
);
