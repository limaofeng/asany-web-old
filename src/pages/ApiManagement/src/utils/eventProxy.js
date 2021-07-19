// eventProxy.js

const eventProxy = {
  onObj: {},
  oneObj: {},
  on(key, fn) {
    if (this.onObj[key] === undefined) {
      this.onObj[key] = [];
    }

    this.onObj[key].push(fn);
  },
  one(key, fn) {
    if (this.oneObj[key] === undefined) {
      this.oneObj[key] = [];
    }

    this.oneObj[key].push(fn);
  },
  off(key) {
    this.onObj[key] = [];
    this.oneObj[key] = [];
  },
  trigger() {
    let key;
    let args;
    if (arguments.length == 0) {
      return false;
    }
    key = arguments[0];
    args = [].concat(Array.prototype.slice.call(arguments, 1));

    if (this.onObj[key] !== undefined && this.onObj[key].length > 0) {
      for (const i in this.onObj[key]) {
        this.onObj[key][i].apply(null, args);
      }
    }
    if (this.oneObj[key] !== undefined && this.oneObj[key].length > 0) {
      for (const i in this.oneObj[key]) {
        this.oneObj[key][i].apply(null, args);
        this.oneObj[key][i] = undefined;
      }
      this.oneObj[key] = [];
    }
  },
};

export default eventProxy;
