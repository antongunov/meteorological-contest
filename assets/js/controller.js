(function (exports) {
  const channels = [];

  class Controller {
    constructor(id, fn) {
      this.id = id;
      this.el = document.getElementById(id);
      if (fn && typeof fn === 'function') this.$load(fn);
    }

    $load(fn) {
      window.addEventListener('load', fn, false);
    }

    $on(channel, fn) {
      channels[channel] = channels[channel] || [];
      channels[channel].push(fn);
    };

    $emit(event, ...args) {
      const channel = `${this.id}:${event}`;
      if (channels[channel]) {
        channels[channel].forEach(fn => fn(...args));
      }
    };
  }

  exports.Controller = Controller;
})(window.App = (window.App || {}));
