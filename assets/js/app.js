(function ({ BarChart, Controller, FilterForm }) {
  const DEFAULT_CHART_TYPE = 'temperature';
  const [MIN_YEAR, MAX_YEAR] = [1881, 2006];

  // create controllers
  const filter = new FilterForm('filter-form', {
    defaultChartType: DEFAULT_CHART_TYPE,
    minYear: MIN_YEAR,
    maxYear: MAX_YEAR,
  });

  const app = new Controller('app', () => {
    app.el.style.display = 'flex';

    const canvas = document.getElementById('canvas');

    const parentSize = canvas.parentNode.getBoundingClientRect();
    canvas.width = parentSize.width;
    canvas.height = parentSize.height;

    app.barChart = new BarChart(canvas, {
      barScale: 0.8,
      colors: {
        positiveValue: '#5799c7',
        negativeValue: '#df5c5d',
      },
    });

    app.drawBarChart(filter.values());

    app.$on('filter-form:update', app.drawBarChart);
  });

  app.drawBarChart = (props) => {
    const t0 = performance.now();

    if (app.worker && app.worker.isBusy) app.worker.terminate();

    app.worker = new Worker('assets/js/store/worker.js');

    app.worker.postMessage(props);
    app.worker.isBusy = true;

    app.worker.onmessage = (event) => {
      if (event.data.error) return console.error(event.data.error);
      app.worker.isBusy = false;

      const values = Object.values(event.data);
      app.barChart.draw(values);

      console.log('dt= ', performance.now() - t0);
    };

    app.worker.onerror = event => console.error(event);
  };

})(window.App);
