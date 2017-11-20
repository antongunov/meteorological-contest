/**
 * Checking if the API data (t) is sorted in ascending order.
 */

const temperature = require('./api/temperature.json');
const precipitation = require('./api/precipitation.json');

console.log(sorted(temperature) && sorted(precipitation));

function sorted(data) {
  let prev_t = '0000-00-00';

  return data.every(({ t }) => {
    if (prev_t > t) return false;
    prev_t = t;
    return true;
  });
}
