(function (exports, Chart) {
  const LABEL_FONT_SIZE = 18;
  const LABEL_MAX_WIDTH = 100;

  class BarChart extends Chart {
    constructor(canvas, options) {
      super(canvas);
      this.options = options;
      this.rect = super.rect();
    }

    draw(values) {
      // reset the canvas
      super.reset();

      // draw axes

      // draw bars
      const bars = this.drawBars(values);

      super.canvas().onmousemove = (event) => {
        // correct mouse position
        const x = event.clientX - this.rect.left;
        const y = event.clientY - this.rect.top;

        // find a bar
        const bar = bars.find(bar => bar.upperLeftCornerX <= x
          && x <= bar.upperLeftCornerX + bar.width
          && bar.upperLeftCornerY <= y
          && y <= bar.upperLeftCornerY + bar.height);

        if (bar) {
          super.updateText({
            text: `${bar.label}= ${bar.value.toFixed(2)}`,
            x: super.widthCanvas() - LABEL_MAX_WIDTH,
            y: LABEL_FONT_SIZE,
            maxWidth: LABEL_MAX_WIDTH,
          });
        }
      }
    }

    drawBars({ values, labels }) {
      const bars = [];

      const [min, max] = Chart.boundaries(values);
      const absMax = Math.max(Math.abs(min), Math.abs(max));

      const heightScale = max > 0 && min < 0 ? 0.5 : 1;
      const heightCanvas = super.heightCanvas(heightScale);
      const offsetY = max < 0 ? 0 : heightCanvas;

      const barCount = values.length;

      const barWidth = super.widthCanvas() / barCount;
      const width = barWidth * this.options.barScale;

      let upperLeftCornerX = barWidth * (1 - this.options.barScale) / 2;

      values.forEach((value, index) => {
        const height = Math.abs((value / absMax) * (heightCanvas - LABEL_FONT_SIZE * 1.1));
        const bar = {
          value,
          label: labels[index],
          upperLeftCornerX,
          upperLeftCornerY: value > 0 ? offsetY - height : offsetY,
          width,
          height,
          color: value > 0 ? this.options.colors.positiveValue : this.options.colors.negativeValue,
        };

        super.drawBar(bar);
        bars.push(bar);

        upperLeftCornerX += barWidth;
      });

      return bars;
    }
  }

  exports.BarChart = BarChart;
})(window.App, window.App.Chart);
