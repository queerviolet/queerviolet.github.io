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
})({"19048380e5c0059c7013c2d6f42a0b18":[function(require,module,exports) {
"use strict";

var _when = require("./when");

require("./type-writer");

require("./seek-able");

var global = arguments[3];
Object.assign(global, {
  When: _when.When,
  For: _when.For,
  buildInRange: _when.buildInRange,
  always: _when.always,
  every: _when.every,
  sec: _when.sec,
  lerp: _when.lerp,
  any: _when.any,
  match: _when.match
});
},{"./when":"e27fc5520f38a91f72f64843b7a2c821","./type-writer":"b45ed699d73c12e404e92859eccf59ad","./seek-able":"ac1a7916262eb2a211ba386400284900"}],"e27fc5520f38a91f72f64843b7a2c821":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.always = always;
exports.When = When;
exports.addAnimator = addAnimator;
exports.removeAnimator = removeAnimator;
exports.any = exports.buildInRange = exports.match = exports.runAnimatorStep = exports.lerp = exports.sec = exports.every = exports.For = exports.unattached = exports.defaultContext = void 0;
var global = arguments[3];

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var defaultContext = {
  add: addAnimator,
  remove: removeAnimator
};
exports.defaultContext = defaultContext;
var unattached = {
  add: function add(_) {},
  remove: function remove(_) {}
};
exports.unattached = unattached;

function always() {
  return true;
}

function When() {
  var condition = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : always;
  var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultContext;
  if ((this instanceof When ? this.constructor : void 0) == null) return new When(condition, ctx);
  this.condition = condition;
  this.running = false;
  this._handlers = {
    start: [],
    frame: [],
    at: [],
    end: [],
    changed: []
  };

  this._resetDone();

  this._ctx = ctx;
  ctx.add && ctx.add(this);
}

var fire = function fire(type) {
  var _ref;

  return _ref = {}, _defineProperty(_ref, type, function (cb) {
    this._handlers[type].push(cb);

    return this;
  }), _defineProperty(_ref, "_fire_".concat(type), function _fire_(ts, currentBuild, lastBuild) {
    var cbs = this._handlers[type];
    var count = cbs.length;

    for (var i = 0; i !== count; ++i) {
      cbs[i].apply(this, [ts, currentBuild, lastBuild]);
    }
  }), _ref;
};

Object.assign.apply(Object, [When.prototype].concat(_toConsumableArray(['start', 'frame', 'at', 'end', 'changed'].map(fire))));

When.prototype._resetDone = function () {
  var _this = this;

  this.done = new Promise(function (_) {
    return _this._resolveDone = _;
  });
};

When.prototype.withName = function (name) {
  this.name = name;
  return this;
};

When.prototype.withDuration = function (duration) {
  this.duration = duration;
  return this;
};

When.prototype.remove = function () {
  this._ctx.remove(this);

  return this;
};

When.prototype.step = function (ts, currentBuild, lastBuild) {
  var shouldRun = this.condition[match](ts, currentBuild, lastBuild);

  if (shouldRun && !this.running) {
    this._fire_start(ts, currentBuild, lastBuild);

    this.startedAt = ts;
    this.running = true;
  }

  if (!shouldRun && this.running) {
    this._fire_end(ts, currentBuild, lastBuild);

    this.endedAt = ts;
    this.running = false;

    this._resolveDone(this);

    this._resetDone();
  }

  if (this.running) {
    if (currentBuild !== lastBuild) this._fire_changed(ts, currentBuild, lastBuild);

    this._fire_frame(ts, currentBuild, lastBuild);

    if (typeof this.duration === 'number') {
      var t = (ts - this.startedAt) / this.duration;
      this.t = t;

      this._fire_at(t, currentBuild, lastBuild);
    }
  }
};

var For = function For(duration) {
  var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultContext;
  var endTime;
  var anim = When(function (ts) {
    return !anim.running || ts < endTime;
  }, ctx).withDuration(duration).start(function (ts) {
    return endTime = ts + duration;
  }).end(function () {
    return ctx.remove(anim);
  });
  return anim;
};

exports.For = For;

var every = function every(interval) {
  var lastTick = null;
  return function (cb) {
    return function (ts, currentBuild, lastBuild) {
      var currentTick = Math.floor((ts - this.startedAt) / interval);
      if (currentTick !== lastTick) cb.apply(this, [ts, currentTick, currentBuild, lastBuild]);
      lastTick = currentTick;
    };
  };
};
/****** Unit utilities ******/


exports.every = every;

var sec = function sec(seconds) {
  return 1000 * seconds;
};

exports.sec = sec;
sec.symbol = Symbol('seconds');

sec[Symbol.toPrimitive] = function () {
  return sec.symbol;
};

Object.defineProperty(Number.prototype, sec, {
  get: function get() {
    return sec(this.valueOf());
  }
});
Object.defineProperty(String.prototype, sec, {
  get: function get() {
    return sec(+this);
  }
});
/****** Animation utils ******/

var lerp = function lerp(from, to) {
  var map = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function (_) {
    return _;
  };
  var delta = to - from;
  return function (t) {
    return map(from + t * delta);
  };
};
/****** Animator framework ******/


exports.lerp = lerp;
global.__animators = global.__animators || [];

global.__cascadeDebug = function () {
  var debug = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  return debug ? log = console : log = debuggingOff;
};

var debuggingOff = {
  log: function log() {},
  table: function table() {}
};
var log = debuggingOff;

function addAnimator(animator) {
  global.__animators.push(animator);

  log.log('added animator', animator);
  log.table(global.__animators);
}

function removeAnimator(animator) {
  var animators = global.__animators;
  var idx = animators.indexOf(animator);
  if (idx >= 0) animators.splice(idx, 1);

  animator._resolveDone();
}

var runAnimatorStep = function runAnimatorStep(ts, currentBuild, prevBuild) {
  var animators = global.__animators;
  var i = animators.length;

  while (i-- > 0) {
    animators[i].step(ts, currentBuild, prevBuild);
  }
};
/****** Condition helpers ******/


exports.runAnimatorStep = runAnimatorStep;
var match = Symbol('when/match');
exports.match = match;
Object.defineProperty(Function.prototype, match, {
  get: function get() {
    return this;
  }
});

HTMLElement.prototype[match] = function (_, current) {
  return current === this;
};

var buildInRange = function buildInRange(from, to) {
  return function (ts, current) {
    return current && current.order >= from.order && current.order <= to.order;
  };
};

exports.buildInRange = buildInRange;

var any = function any() {
  for (var _len = arguments.length, matchers = new Array(_len), _key = 0; _key < _len; _key++) {
    matchers[_key] = arguments[_key];
  }

  return function (ts, current, next) {
    return matchers.some(function (m) {
      return m[match](ts, current, next);
    });
  };
};

exports.any = any;
},{}],"b45ed699d73c12e404e92859eccf59ad":[function(require,module,exports) {
"use strict";

var _when = require("./when");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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

var ceil = Math.ceil,
    floor = Math.floor;

var TypeWriter = /*#__PURE__*/function (_HTMLElement) {
  _inherits(TypeWriter, _HTMLElement);

  var _super = _createSuper(TypeWriter);

  _createClass(TypeWriter, null, [{
    key: "observedAttributes",
    get: function get() {
      return ['text'];
    }
  }]);

  function TypeWriter() {
    var _this;

    _classCallCheck(this, TypeWriter);

    _this = _super.call(this);

    var shadow = _this.attachShadow({
      mode: 'open'
    });

    var text = document.createTextNode('');
    var cursor = document.createElement('span');
    var style = document.createElement('style');
    style.textContent = TypeWriter.style;
    cursor.className = 'blinking cursor';
    shadow.appendChild(style);
    shadow.appendChild(text);
    shadow.appendChild(cursor);
    _this.cursor = cursor;
    _this.textNode = text;
    _this.currentTargetText = '';
    return _this;
  }

  _createClass(TypeWriter, [{
    key: "type",
    value: function type(input) {
      var _this2 = this;

      var rate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.typingRate;
      var text = this.textNode;
      var startText = text.textContent;
      if (this.anim) this.anim.remove();
      return this.anim = (0, _when.For)(input.length[_when.sec] / rate).withName('typing').start(function () {
        return _this2.cursor.classList.remove('blinking');
      }).at(function (t) {
        return text.textContent = startText + input.substr(0, ceil(t * input.length));
      }).end(function () {
        _this2.cursor.classList.add('blinking');

        text.textContent = startText + input;
      });
    }
  }, {
    key: "erase",
    value: function erase() {
      var _this3 = this;

      var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.textNode.textContent.length;
      var rate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.erasingRate;
      var text = this.textNode;
      var startText = text.textContent;
      var length = (0, _when.lerp)(startText.length, startText.length - count);
      if (this.anim) this.anim.remove();
      return this.anim = (0, _when.For)(count[_when.sec] / rate).withName('erasing').start(function () {
        return _this3.cursor.classList.remove('blinking');
      }).at(function (t) {
        return text.textContent = startText.substr(0, floor(length(t)));
      }).end(function () {
        text.textContent = startText.substr(0, startText.length - count);

        _this3.cursor.classList.add('blinking');
      });
    }
  }, {
    key: "attributeChangedCallback",
    value: function () {
      var _attributeChangedCallback = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(name, oldValue, newValue) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (name === 'text') this.setText(newValue);

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function attributeChangedCallback(_x, _x2, _x3) {
        return _attributeChangedCallback.apply(this, arguments);
      }

      return attributeChangedCallback;
    }()
  }, {
    key: "setText",
    value: function () {
      var _setText = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(newText) {
        var textNode, currentText, prefixLength, delta;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                textNode = this.textNode;

                if (!(this.currentTargetText === newText)) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt("return");

              case 3:
                this.currentTargetText = newText;
                currentText = this.text;
                prefixLength = commonPrefix(currentText, newText);
                delta = currentText.length - prefixLength;

                if (!delta) {
                  _context2.next = 10;
                  break;
                }

                _context2.next = 10;
                return this.erase(delta).done;

              case 10:
                this.type(newText.substr(prefixLength));

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function setText(_x4) {
        return _setText.apply(this, arguments);
      }

      return setText;
    }()
  }, {
    key: "text",
    set: function set(newText) {
      this.setText(newText);
    },
    get: function get() {
      return this.textNode.textContent;
    }
  }, {
    key: "typingRate",
    get: function get() {
      return +getComputedStyle(this).getPropertyValue('--typewriter-typing-rate') || 32;
    }
  }, {
    key: "erasingRate",
    get: function get() {
      return +getComputedStyle(this).getPropertyValue('--typewriter-erasing-rate') || 60;
    }
  }]);

  return TypeWriter;
}( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

var commonPrefix = function commonPrefix(a, b) {
  for (var i = 0; i != a.length; ++i) {
    if (a[i] !== b[i]) return i;
  }

  return a.length;
};

TypeWriter.style = "\n.cursor {\n  display: inline-block;\n  background: var(--typewriter-cursor-color);\n  width: 2px;\n  height: 1.2em;\n  position: relative;\n  top: 0.2em;\n}\n\n.cursor.blinking {\n  animation-name: blink;\n  animation-duration: var(--typewriter-cursor-blink-rate);\n  animation-iteration-count: infinite;\n}\n\n@keyframes blink {\n  0% { opacity: 1; }\n  50% { opacity: 1; }\n  60% { opacity: 0; }\n  90% { opacity: 0; }\n  100% { opacity: 1; }\n}\n";
customElements.define('type-writer', TypeWriter);
if (module.hot) module.hot.accept(function () {
  return false;
});
},{"./when":"e27fc5520f38a91f72f64843b7a2c821"}],"ac1a7916262eb2a211ba386400284900":[function(require,module,exports) {
"use strict";

var _when = require("./when");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Seekable = function Seekable(MediaBase) {
  return /*#__PURE__*/function (_MediaBase) {
    _inherits(SeekAble, _MediaBase);

    var _super = _createSuper(SeekAble);

    function SeekAble() {
      _classCallCheck(this, SeekAble);

      return _super.apply(this, arguments);
    }

    _createClass(SeekAble, [{
      key: "seekTo",
      value: function seekTo(_ref) {
        var _this = this;

        var _ref$duration = _ref.duration,
            seekDuration = _ref$duration === void 0 ? 1 : _ref$duration,
            _ref$time = _ref.time,
            time = _ref$time === void 0 ? this.currentTime : _ref$time,
            _ref$playbackRate = _ref.playbackRate,
            playbackRate = _ref$playbackRate === void 0 ? this.playbackRate : _ref$playbackRate,
            _ref$paused = _ref.paused,
            paused = _ref$paused === void 0 ? this.paused : _ref$paused;

        if (this.anim) {
          this.anim.remove();
          this.anim = null;
        }

        if (!seekDuration || time < this.currentTime) this.currentTime = time;

        var setFinalState = function setFinalState() {
          _this.currentTime = time;
          _this.playbackRate = playbackRate;
          if (typeof paused !== 'undefined') paused ? _this.pause() : _this.play();
        };

        if (seekDuration && this.currentTime !== time) {
          if (this.paused) this.play();
          var endTime = null;
          var duration = seekDuration[_when.sec];
          return this.anim = (0, _when.For)(seekDuration[_when.sec]).withName('seekVideo').start(function (ts) {
            return endTime = ts + duration;
          }).frame((0, _when.every)(0.5[_when.sec])(function (ts) {
            var remaining = endTime - ts;
            var delta = (time - _this.currentTime)[_when.sec];
            var targetRate = Math.min(Math.max(delta / remaining, 0.1), 5);
            _this.playbackRate = targetRate;
          })).end(setFinalState);
        }

        setFinalState();
      }
    }]);

    return SeekAble;
  }(MediaBase);
};

customElements.define('seekable-video', Seekable(HTMLVideoElement), {
  extends: 'video'
});
customElements.define('seekable-audio', Seekable(HTMLAudioElement), {
  extends: 'audio'
});
},{"./when":"e27fc5520f38a91f72f64843b7a2c821"}]},{},["19048380e5c0059c7013c2d6f42a0b18"], null)

