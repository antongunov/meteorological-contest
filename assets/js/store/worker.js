importScripts('database.js');
importScripts('request.js');

const DB_NAME = 'meteorological-contest';
const DB_VERSION = 1;
const DB_SCHEMES = [
  {
    storeName: 'temperature',
    keyPath: 'm',
  },
  {
    storeName: 'precipitation',
    keyPath: 'm',
  },
];

// create a database promise
const dbPromise = openDb({
  name: DB_NAME,
  version: DB_VERSION,
  schemes: DB_SCHEMES,
});

const extract = format => time => time.slice(0, format.length);
const extract_m = extract('YYYY-MM');
const extract_year = extract('YYYY');

const count = (chartType) => new Promise((resolve, reject) => dbPromise.then((db) => {
  const tx = db.transaction(chartType, 'readonly');
  const store = tx.objectStore(chartType);
  const req = store.count();

  let cnt = 0;

  req.onsuccess = () => cnt = req.result;
  req.onerror = event => reject(event);

  tx.oncomplete = () => resolve(cnt);
  tx.onerror = event => reject(event);

}).catch(err => reject(err)));

const init = (chartType, data) => new Promise((resolve, reject) => dbPromise.then((db) => {
  const tx = db.transaction(chartType, 'readwrite');
  const store = tx.objectStore(chartType);

  // it will be working if the data (t) is sorted in ascending order
  store.add(data.reduce(({ m, tvs }, { t, v }) => {
    if (m === extract_m(t)) {
      tvs.push({ t, v });
      return { m, tvs };
    } else {
      store.add({ m, tvs });
      tvs = [];
      tvs.push({ t, v });
      return { m: extract_m(t), tvs };
    }
  }, { m: extract_m(data[0].t), tvs: [] }));

  tx.oncomplete = () => resolve();
  tx.onerror = event => reject(event);

}).catch(err => reject(err)));

const calc = ({ chartType, fromYear, toYear }) => new Promise((resolve, reject) => dbPromise.then((db) => {
  const keyRange = IDBKeyRange.bound(fromYear + '-01', toYear + '-12');

  const tx = db.transaction(chartType, 'readonly');
  const store = tx.objectStore(chartType);

  let year = fromYear;
  let sum = 0;
  let count = 0;
  let data = {};

  const storeCursor = store.openCursor(keyRange);

  storeCursor.onsuccess = (event) => {
    const cursor = event.target.result;

    if (cursor) {
      let { m, tvs } = cursor.value;

      if (year === extract_year(m)) {
        sum += tvs.reduce((s, { v }) => s + v, 0);
        count += tvs.length;
      } else {
        data[year] = sum/count;
        sum = tvs.reduce((s, { v }) => s + v, 0);
        count = tvs.length;
        year = extract_year(m);
      }

      cursor.continue();
    } else {
      // add last year
      data[year] = sum/count;
    }
  };

  storeCursor.onerror = event => reject(event);
  tx.onerror = event => reject(event);

  tx.oncomplete = () => resolve(data);

}).catch(err => reject(err)));

async function groupByYear(params) {
  const { chartType } = params;
  try {
    // how to check and init data at one transaction in IndexedDB?
    const cnt = await count(chartType);
    // init data if not exists
    if (!(cnt > 0)) {
      await init(chartType, await request(`/api/${chartType}.json`));
    }
    return await calc(params);
  } catch (err) {
    return Promise.reject(err);
  }
}

self.addEventListener('message', event => groupByYear(event.data)
  .then(data => self.postMessage(data))
  .catch(err => self.postMessage({ error: err })), false);
