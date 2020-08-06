// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
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

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
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
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"when.js":[function(require,module,exports) {
var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.always = always;
exports.When = When;
exports.addAnimator = addAnimator;
exports.removeAnimator = removeAnimator;
exports.any = exports.buildInRange = exports.match = exports.runAnimatorStep = exports.lerp = exports.sec = exports.every = exports.For = exports.unattached = exports.defaultContext = void 0;
const defaultContext = {
  add: addAnimator,
  remove: removeAnimator
};
exports.defaultContext = defaultContext;
const unattached = {
  add: _ => {},
  remove: _ => {}
};
exports.unattached = unattached;

function always() {
  return true;
}

function When(condition = always, ctx = defaultContext) {
  if (new.target == null) return new When(condition, ctx);
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

const fire = type => ({
  [type](cb) {
    this._handlers[type].push(cb);

    return this;
  },

  [`_fire_${type}`](ts, currentBuild, lastBuild) {
    const cbs = this._handlers[type];
    const count = cbs.length;

    for (let i = 0; i !== count; ++i) cbs[i].apply(this, [ts, currentBuild, lastBuild]);
  }

});

Object.assign(When.prototype, ...['start', 'frame', 'at', 'end', 'changed'].map(fire));

When.prototype._resetDone = function () {
  this.done = new Promise(_ => this._resolveDone = _);
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
  const shouldRun = this.condition[match](ts, currentBuild, lastBuild);

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
      const t = (ts - this.startedAt) / this.duration;
      this.t = t;

      this._fire_at(t, currentBuild, lastBuild);
    }
  }
};

const For = (duration, ctx = defaultContext) => {
  let endTime;
  const anim = When(ts => !anim.running || ts < endTime, ctx).withDuration(duration).start(ts => endTime = ts + duration).end(() => ctx.remove(anim));
  return anim;
};

exports.For = For;

const every = interval => {
  let lastTick = null;
  return cb => function (ts, currentBuild, lastBuild) {
    const currentTick = Math.floor((ts - this.startedAt) / interval);
    if (currentTick !== lastTick) cb.apply(this, [ts, currentTick, currentBuild, lastBuild]);
    lastTick = currentTick;
  };
};
/****** Unit utilities ******/


exports.every = every;

const sec = seconds => 1000 * seconds;

exports.sec = sec;
sec.symbol = Symbol('seconds');

sec[Symbol.toPrimitive] = () => sec.symbol;

Object.defineProperty(Number.prototype, sec, {
  get() {
    return sec(this.valueOf());
  }

});
Object.defineProperty(String.prototype, sec, {
  get() {
    return sec(+this);
  }

});
/****** Animation utils ******/

const lerp = (from, to, map = _ => _) => {
  const delta = to - from;
  return t => map(from + t * delta);
};
/****** Animator framework ******/


exports.lerp = lerp;
global.__animators = global.__animators || [];

global.__cascadeDebug = (debug = true) => debug ? log = console : log = debuggingOff;

const debuggingOff = {
  log() {},

  table() {}

};
let log = debuggingOff;

function addAnimator(animator) {
  global.__animators.push(animator);

  log.log('added animator', animator);
  log.table(global.__animators);
}

function removeAnimator(animator) {
  const animators = global.__animators;
  const idx = animators.indexOf(animator);
  if (idx >= 0) animators.splice(idx, 1);

  animator._resolveDone();
}

const runAnimatorStep = (ts, currentBuild, prevBuild) => {
  const animators = global.__animators;
  let i = animators.length;

  while (i-- > 0) animators[i].step(ts, currentBuild, prevBuild);
};
/****** Condition helpers ******/


exports.runAnimatorStep = runAnimatorStep;
const match = Symbol('when/match');
exports.match = match;
Object.defineProperty(Function.prototype, match, {
  get() {
    return this;
  }

});

HTMLElement.prototype[match] = function (_, current) {
  return current === this;
};

const buildInRange = (from, to) => (ts, current) => current && current.order >= from.order && current.order <= to.order;

exports.buildInRange = buildInRange;

const any = (...matchers) => (ts, current, next) => matchers.some(m => m[match](ts, current, next));

exports.any = any;
},{}],"type-writer.js":[function(require,module,exports) {
"use strict";

var _when = require("./when");

const {
  ceil,
  floor
} = Math;

class TypeWriter extends HTMLElement {
  static get observedAttributes() {
    return ['text'];
  }

  constructor() {
    super();
    const shadow = this.attachShadow({
      mode: 'open'
    });
    const text = document.createTextNode('');
    const cursor = document.createElement('span');
    const style = document.createElement('style');
    style.textContent = TypeWriter.style;
    cursor.className = 'blinking cursor';
    shadow.appendChild(style);
    shadow.appendChild(text);
    shadow.appendChild(cursor);
    this.cursor = cursor;
    this.textNode = text;
    this.currentTargetText = '';
  }

  type(input, rate = this.typingRate) {
    const {
      textNode: text
    } = this;
    const startText = text.textContent;
    if (this.anim) this.anim.remove();
    return this.anim = (0, _when.For)(input.length[_when.sec] / rate).withName('typing').start(() => this.cursor.classList.remove('blinking')).at(t => text.textContent = startText + input.substr(0, ceil(t * input.length))).end(() => {
      this.cursor.classList.add('blinking');
      text.textContent = startText + input;
    });
  }

  erase(count = this.textNode.textContent.length, rate = this.erasingRate) {
    const {
      textNode: text
    } = this;
    const startText = text.textContent;
    const length = (0, _when.lerp)(startText.length, startText.length - count);
    if (this.anim) this.anim.remove();
    return this.anim = (0, _when.For)(count[_when.sec] / rate).withName('erasing').start(() => this.cursor.classList.remove('blinking')).at(t => text.textContent = startText.substr(0, floor(length(t)))).end(() => {
      text.textContent = startText.substr(0, startText.length - count);
      this.cursor.classList.add('blinking');
    });
  }

  async attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'text') this.setText(newValue);
  }

  set text(newText) {
    this.setText(newText);
  }

  get text() {
    return this.textNode.textContent;
  }

  async setText(newText) {
    const {
      textNode
    } = this;
    if (this.currentTargetText === newText) return;
    this.currentTargetText = newText;
    const currentText = this.text;
    const prefixLength = commonPrefix(currentText, newText);
    const delta = currentText.length - prefixLength;
    if (delta) await this.erase(delta).done;
    this.type(newText.substr(prefixLength));
  }

  get typingRate() {
    return +getComputedStyle(this).getPropertyValue('--typewriter-typing-rate') || 32;
  }

  get erasingRate() {
    return +getComputedStyle(this).getPropertyValue('--typewriter-erasing-rate') || 60;
  }

}

const commonPrefix = (a, b) => {
  for (let i = 0; i != a.length; ++i) {
    if (a[i] !== b[i]) return i;
  }

  return a.length;
};

TypeWriter.style = `
.cursor {
  display: inline-block;
  background: var(--typewriter-cursor-color);
  width: 2px;
  height: 1.2em;
  position: relative;
  top: 0.2em;
}

.cursor.blinking {
  animation-name: blink;
  animation-duration: var(--typewriter-cursor-blink-rate);
  animation-iteration-count: infinite;
}

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 1; }
  60% { opacity: 0; }
  90% { opacity: 0; }
  100% { opacity: 1; }
}
`;
customElements.define('type-writer', TypeWriter);
if (module.hot) module.hot.accept(() => false);
},{"./when":"when.js"}],"seek-able.js":[function(require,module,exports) {
"use strict";

var _when = require("./when");

const Seekable = MediaBase => class SeekAble extends MediaBase {
  seekTo({
    duration: seekDuration = 1,
    time = this.currentTime,
    playbackRate = this.playbackRate,
    paused = this.paused
  }) {
    if (this.anim) {
      this.anim.remove();
      this.anim = null;
    }

    if (!seekDuration || time < this.currentTime) this.currentTime = time;

    const setFinalState = () => {
      this.currentTime = time;
      this.playbackRate = playbackRate;
      if (typeof paused !== 'undefined') paused ? this.pause() : this.play();
    };

    if (seekDuration && this.currentTime !== time) {
      if (this.paused) this.play();
      let endTime = null;
      const duration = seekDuration[_when.sec];
      return this.anim = (0, _when.For)(seekDuration[_when.sec]).withName('seekVideo').start(ts => endTime = ts + duration).frame((0, _when.every)(0.5[_when.sec])(ts => {
        const remaining = endTime - ts;
        const delta = (time - this.currentTime)[_when.sec];
        const targetRate = Math.min(Math.max(delta / remaining, 0.1), 5);
        this.playbackRate = targetRate;
      })).end(setFinalState);
    }

    setFinalState();
  }

};

customElements.define('seekable-video', Seekable(HTMLVideoElement), {
  extends: 'video'
});
customElements.define('seekable-audio', Seekable(HTMLAudioElement), {
  extends: 'audio'
});
},{"./when":"when.js"}],"elements.ts":[function(require,module,exports) {
var global = arguments[3];
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const when_1 = require("./when");

Object.assign(global, {
  When: when_1.When,
  For: when_1.For,
  buildInRange: when_1.buildInRange,
  always: when_1.always,
  every: when_1.every,
  sec: when_1.sec,
  lerp: when_1.lerp,
  any: when_1.any,
  match: when_1.match
});

require("./type-writer");

require("./seek-able");
},{"./when":"when.js","./type-writer":"type-writer.js","./seek-able":"seek-able.js"}],"../../../.nvm/versions/node/v12.3.1/lib/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "62736" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../.nvm/versions/node/v12.3.1/lib/node_modules/parcel/src/builtins/hmr-runtime.js","elements.ts"], null)
//# sourceMappingURL=https://ashi.io/constellation/elements.b4e7f8a2.js.map