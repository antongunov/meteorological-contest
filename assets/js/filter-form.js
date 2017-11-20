(function (exports, Controller) {
  class FilterForm extends Controller {
    constructor(id, { defaultChartType, minYear, maxYear }) {
      super(id, () => {
        this.form = document.getElementById(id);
        const { fromYear, toYear, chartType } = this.form;

        // init select values
        for (let year = minYear; year <= maxYear; year++) {
          fromYear.appendChild(new Option(year));
          toYear.appendChild(new Option(year));
        }

        // init from year
        fromYear.value = minYear;
        fromYear.onchange = (event) => {
          const value = event.target.value;
          if (value > toYear.value) toYear.value = value;
          super.$emit('update', this.values());
        };
        fromYear.disabled = false;

        // init to year
        toYear.value = maxYear;
        toYear.onchange = (event) => {
          const value = event.target.value;
          if (value < fromYear.value) fromYear.value = value;
          super.$emit('update', this.values());
        };
        toYear.disabled = false;

        // init chart type
        chartType.forEach(item => item.onclick = (event) => {
          chartType.value = event.target.value;
          super.$emit('update', this.values());
        });
        chartType.value = defaultChartType;
      });
    }

    values() {
      return {
        chartType: this.form.chartType.value,
        fromYear: this.form.fromYear.value,
        toYear: this.form.toYear.value,
      };
    }
  }

  exports.FilterForm = FilterForm;
})(window.App, window.App.Controller);
