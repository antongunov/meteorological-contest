/**
 * Calculate the API data for checking store & worker modules and print in CSV format.
 */

if (!process.argv[2]) {
  console.log('Usage: node calc temperature|precipitation');
  process.exit();
}

const data = require(`./api/${process.argv[2]}.json`);

const key = t => t.slice(0, 4);
const print = ([year, sum, count]) => console.log(`${year};${sum/count}`.replace('.', ','));

// it will be working if the data (t) is sorted in ascending order
print(data.reduce(([year, sum, count], { t, v }) => {
  if (year === key(t)) {
    return [year, sum + v, count + 1];
  } else {
    print([year, sum, count]);
    return [key(t), v, 1];
  }
}, [key(data[0].t), 0, 0]));
