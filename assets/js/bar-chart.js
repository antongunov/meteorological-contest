(function (exports, Chart) {
  class BarChart extends Chart {
    constructor(canvas, options) {
      super(canvas);
      this.options = options;
    }

    draw(values) {
      // reset the canvas
      super.reset();
      // draw axes
      // draw bars
      this.drawBars(values);
    }

    drawBars(values) {
      const [min, max] = Chart.boundaries(values);
      const absMax = Math.max(Math.abs(min), Math.abs(max));

      const heightScale = max > 0 && min < 0 ? 0.5 : 1;
      const heightCanvas = super.heightCanvas(heightScale);
      const offsetY = max < 0 ? 0 : heightCanvas;

      const barCount = values.length;

      const barWidth = super.widthCanvas() / barCount;
      const width = barWidth * this.options.barScale;

      let upperLeftCornerX = barWidth * (1 - this.options.barScale) / 2;

      values.forEach(value => {
        const height = (value / absMax) * heightCanvas;
        super.drawBar({
          upperLeftCornerX,
          upperLeftCornerY: offsetY - height,
          width,
          height,
          color: value > 0 ? this.options.colors.positiveValue : this.options.colors.negativeValue,
        });
        upperLeftCornerX += barWidth;
      });
    }
  }

  exports.BarChart = BarChart;
})(window.App, window.App.Chart);
