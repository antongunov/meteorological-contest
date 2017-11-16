(function (exports) {
  class Chart {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
    }

    heightCanvas(scale = 1) {
      return this.canvas.height * scale;
    }

    widthCanvas(scale = 1) {
      return this.canvas.width * scale;
    }

    drawLine({ startX, startY, endX, endY, color }) {
      this.ctx.save();
      this.ctx.strokeStyle = color;
      this.ctx.beginPath();
      this.ctx.moveTo(startX, startY);
      this.ctx.lineTo(endX, endY);
      this.ctx.stroke();
      this.ctx.restore();
    }

    drawBar({ upperLeftCornerX, upperLeftCornerY, width, height, color }) {
      this.ctx.save();
      this.ctx.fillStyle = color;
      this.ctx.fillRect(upperLeftCornerX, upperLeftCornerY, width, height);
      this.ctx.restore();
    }

    static boundaries(values) {
      if (!Array.isArray(values) || values.length < 1) return void 0;
      if (values.length === 1) return [values[0], values[0]];
      return values.reduce(([min, max], value) => [value < min ? value : min, value > max ? value : max], [values[0], values[1]]);
    }

    reset() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  exports.Chart = Chart;
})(window.App = (window.App || {}));
