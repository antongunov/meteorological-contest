const request = url => new Promise((resolve, reject) => {
  const xhr = new XMLHttpRequest();

  xhr.open('GET', url, true);

  // IE11 does not support when the `responseType` is set to `json`
  // xhr.responseType = 'json';

  xhr.onload = function () {
    try {
      if (this.status !== 200) {
        reject(new Error(`Request error: uri=${url} status= ${this.status}`));
      } else {
        resolve(JSON.parse(this.responseText));
      }
    } catch (err) {
      reject(err);
    }
  };

  xhr.onerror = err => reject(err);
  xhr.ontimeout = err => reject(err);

  xhr.send();
});
