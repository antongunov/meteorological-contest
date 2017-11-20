const openDb = ({ name, version, schemes }) => new Promise((resolve, reject) => {
  const req = indexedDB.open(name, version);

  req.onupgradeneeded = () => {
    // the database did not previously exist, so create object stores and indexes
    const upgradeDb = req.result;

    schemes.forEach((scheme) => {
      if (!upgradeDb.objectStoreNames.contains(scheme.storeName)) {
        upgradeDb.createObjectStore(scheme.storeName, { keyPath: scheme.keyPath });
      }
    });
  };

  req.onerror = event => reject(event);
  req.onsuccess = () => resolve(req.result);
});
