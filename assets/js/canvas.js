(function (exports, Controller) {
  class Canvas extends Controller {
    constructor(id) {
      super(id, () => {
        const canvas = document.getElementById(id);
        const parentSize = canvas.parentNode.getBoundingClientRect();
        canvas.width = parentSize.width;
        canvas.height = parentSize.height;
      });
    }
  }

  exports.Canvas = Canvas;
})(window.App, window.App.Controller);
