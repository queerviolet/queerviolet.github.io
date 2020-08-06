// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function(modules, cache, entry, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject.parcelRequire === 'function' &&
    globalObject.parcelRequire;
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x) {
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function(id, exports) {
    modules[id] = [
      function(require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  globalObject.parcelRequire = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function() {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"6a4bab44f1c20b4ffe1f490253cec99e":[function(require,module,exports) {
var process = require("process");

var global = arguments[3];

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var BuildNote = /*#__PURE__*/function (_HTMLElement) {
  _inherits(BuildNote, _HTMLElement);

  var _super = _createSuper(BuildNote);

  function BuildNote() {
    _classCallCheck(this, BuildNote);

    return _super.apply(this, arguments);
  }

  _createClass(BuildNote, [{
    key: "connectedCallback",
    value: function connectedCallback() {
      this.addEventListener('click', this.onClick);
    }
  }, {
    key: "disconnectedCallback",
    value: function disconnectedCallback() {
      this.removeEventListener('click', this.onClick);
    }
  }, {
    key: "onClick",
    value: function onClick() {
      localStorage.currentBuild = this.id;
      update({
        key: 'currentBuild',
        newValue: this.id
      });
    }
  }, {
    key: "update",
    value: function update(_ref) {
      var innerHTML = _ref.innerHTML,
          order = _ref.order,
          id = _ref.id;
      this.id = id;
      this.title.textContent = id;
      this.content.innerHTML = innerHTML.trim();
      this.style.order = order;
    }
  }, {
    key: "title",
    get: function get() {
      return findOrCreateByClass('h1', 'title', this);
    }
  }, {
    key: "content",
    get: function get() {
      return findOrCreateByClass('div', 'note', this);
    }
  }, {
    key: "timer",
    get: function get() {
      return findOrCreateByClass('div', 'timer', this);
    }
  }, {
    key: "time",
    set: function set(time) {
      this.timer.textContent = time && tformat(time);
    }
  }], [{
    key: "update",
    value: function update(note) {
      var e = findOrCreateById('build-note', note.id);
      e.update(note);
    }
  }]);

  return BuildNote;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

customElements.define('build-note', BuildNote);

var findOrCreateById = function findOrCreateById(tag, id) {
  var container = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.body;
  var e = document.getElementById(id);
  if (e) return e;
  container.appendChild(e = document.createElement(tag));
  return e;
};

var findOrCreateByClass = function findOrCreateByClass(tag, className) {
  var container = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.body;
  var e = container.getElementsByClassName(className)[0];
  if (e) return e;
  e = document.createElement(tag);
  e.className = className;
  container.appendChild(e);
  return e;
};

var BUILDS = {};

var updateNotes = function updateNotes() {
  var notes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : JSON.parse(localStorage.buildNotes);
  notes.forEach(function (note) {
    BuildNote.update(note);
    BUILDS[note.id] = note;
  });
};

var updateScroll = function updateScroll() {
  var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : localStorage.currentBuild;
  var e = document.getElementById(id);
  if (!e) return;
  process.nextTick(function () {
    return e.scrollIntoView({
      block: 'start',
      behavior: 'smooth'
    });
  });
  var current = document.querySelector('build-note.current');
  current && current.classList.remove('current');
  e.classList.add('current');
};

var init = function init() {
  return Object.entries(localStorage).forEach(function (_ref2) {
    var _ref3 = _slicedToArray(_ref2, 2),
        key = _ref3[0],
        newValue = _ref3[1];

    return update({
      key: key,
      newValue: newValue
    });
  });
};

function onKey(_ref4) {
  var code = _ref4.code;

  switch (code) {
    case 'ArrowRight':
    case 'PageDown':
      var next = BUILDS[localStorage.currentBuild].nextBuildId;

      if (next) {
        localStorage.currentBuild = next;
        update({
          key: 'currentBuild',
          newValue: next
        });
      }

      return;

    case 'ArrowLeft':
    case 'PageUp':
      var prev = BUILDS[localStorage.currentBuild].prevBuildId;

      if (prev) {
        localStorage.currentBuild = prev;
        update({
          key: 'currentBuild',
          newValue: prev
        });
      }

      return;
  }
}

function update(_ref5) {
  var key = _ref5.key,
      newValue = _ref5.newValue,
      oldValue = _ref5.oldValue;

  switch (key) {
    case 'currentBuild':
      return updateScroll(newValue);

    case 'buildNotes':
      return updateNotes(JSON.parse(newValue));
  }

  if (key.startsWith('time:')) {
    var e = document.getElementById(key.substr(5));
    if (e) e.time = newValue;
  }
}

addEventListener('DOMContentLoaded', init);
addEventListener('storage', update);
addEventListener('keydown', onKey);
var raf = null;

__timer.addEventListener('click', function () {
  if (raf) {
    console.log('cancelling', raf);
    cancelAnimationFrame(raf);

    __timer.classList.remove('running');

    raf = null;
    return;
  }

  lastTick = null;
  raf = requestAnimationFrame(tick);
});

var lastTick = null;

function tick(ts) {
  raf = requestAnimationFrame(tick);

  __timer.classList.add('running');

  if (!lastTick) return lastTick = ts;
  var delta = ts - lastTick;
  lastTick = ts;
  var elapsed = (+localStorage.totalTime || 0) + delta;
  localStorage.totalTime = elapsed;
  __timer_display.textContent = tformat(elapsed);
  var buildKey = "time:".concat(localStorage.currentBuild);
  var buildTime = +localStorage[buildKey] || 0;
  localStorage[buildKey] = buildTime + delta;
  update({
    key: buildKey,
    newValue: buildTime
  });
  update({
    key: 'totalTime',
    newValue: elapsed
  });
}

var floor = Math.floor;

var tformat = function tformat(ms) {
  var sec = +ms / 1000;
  var min = sec / 60;
  return "".concat(zpad(floor(min)), ":").concat(zpad(floor(sec % 60)));
};

var zpad = function zpad(x) {
  var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  var str = '' + x;
  if (str.length < count) return new Array(count - str.length).fill(0).join('') + str;
  return str;
};

var resetTimer = function resetTimer() {
  localStorage.removeItem('totalTime');
  update({
    key: 'totalTime'
  });
  Object.keys(localStorage).filter(function (k) {
    return k.startsWith('time:');
  }).forEach(function (key) {
    localStorage.removeItem(key);
    update({
      key: key
    });
  });
};

global.resetTimer = resetTimer;
},{"process":"1bd46d3b3efd2320fe280e4c70db6ed0"}],"1bd46d3b3efd2320fe280e4c70db6ed0":[function(require,module,exports) {
// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}]},{},["6a4bab44f1c20b4ffe1f490253cec99e"], null)

