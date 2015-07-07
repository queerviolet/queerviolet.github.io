(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*

A Blob is a shape in two-dimensional integer coordinate space where all cells have at least one
adjoining cell to the right, left, top, or bottom that is also occupied. Given a 10x10 array of 
boolean values that represents a Blob uniformly selected at random from the set of all possible 
Blobs that could occupy that array, write a program that will determine the Blob boundaries. 
Optimize first for finding the correct result, second for performing a minimum number of cell 
Boolean value reads, and third for the elegance and clarity of the solution.

Sample input:

0000000000
0011100000
0011111000
0010001000
0011111000
0000101000
0000101000
0000111000
0000000000
0000000000

Sample output:

Cell Reads: 44
Top: 1
Left: 2
Bottom: 7
Right: 6

*/

"use strict";

// findBlobOutline(tile: Tile) -> {
//   blob: {top, left, bottom, right},
//   tile: Tile,
//   cache: {hits: int, misses: int, reads: []{location, value, hit}}
// }
//
// Returns the bounding box of the first blob it encounters,
// along with the tile it operated on and some statistics about
// its internal cache, used to minimize requests to the underlying
// tile.
//
// This algorithm works by scanning for any live pixel, then
// scanning the outline of the discovered shape. This approach is
// more efficient than the BFS or concentric fill, particularly
// for blobs with large filled areas.
function findBlobOutline(tile) {
  var original = tile;
  tile = Tile.cache(tile);

  var visited = {};
  var here = southeast(tile, visited);
  if (!here) { return null; }  // couldn't find a blob.

  var blob = {
    top: here[0],
    left: here[1],
    bottom: here[0],
    right: here[1],
  };

  // This algorithm stores a visited set of (location, bearing),
  // rather than just location. This enables us to write an algorithm
  // which doesn't backtrack. Instead, it bails out as soon as it
  // would have to walk in a circle. We define walking in a circle
  // as stepping onto a pixel we've been before, in the same direction.
  // "Daisy, this hallway feels very familiar."
  //
  // We can cross our own path (walk on a pixel we've visted before,
  // but in a different direction), which allows us to follow long,
  // single-pixel "piers" and still return from them.

  // key(location, bearing) -> str
  //   Returns a string encoding location and bearing we can use as a key
  //   in our hash.
  function key(location, bearing) {
    return location + '@' + bearing;
  }

  // The southeast function sweeps westward. Add visited
  // keys with the appropriate bearing to the visited set.
  for (var loc in visited) {
    visited[key(loc, west)] = true;
  }

  // And start facing west, since that's the direction we
  // were sweeping.
  var bearing = west;

  var done = false;
  while (!done) {
    // Record (here, bearing) as a place and direction we've
    // done already.
    visited[key(here, bearing)] = true;

    // Expand the bounding box if needed.
    var row = here[0], col = here[1];
    if (row < blob.top)   blob.top = row;
    if (col < blob.left)  blob.left = col;
    if (col > blob.right) blob.right = col;

    // We're done unless we can find an adjacent pixel to step
    // onto.
    done = true;

    // Start the scan 90 degrees clockwise from our current
    // bearing. This means that we're constantly trying to turn right,
    // performing what I'm going to call an adventurer's labyrinth
    // traversal of the blob.
    var scan = bearing.clockwise;
    for (var i = 0; i != directions.length; ++i) {
      var there = [here[0] + scan[0], here[1] + scan[1]];
      // If we see a live pixel that we haven't been to on that bearing
      if (!visited[key(there, scan)] && tile(there[0], there[1])) {
        here = there;
        bearing = scan;
        done = false;
        break;
      }
      scan = scan.ccwise;
    }
  }

  return {blob: blob, cache: tile, tile: original};  
}


// findBlobBfs(tile: Tile) -> {
//   blob: {top, left, bottom, right},
//   tile: Tile,
//   cache: {hits: int, misses: int, reads: []{location, value, hit}}
// }
//
// Returns the bounding box of the first blob it encounters,
// along with the tile it operated on and some statistics about
// its internal cache, used to minimize requests to the underlying
// tile.
//
// This algorithm works by scanning for any live pixel, then
// performing a breadth first fill. This is the first algorithm
// I implemented, because it's so straightforward. Alas, it performs
// a lot of unnecessary reads on internal pixels, since it finds the
// whole shape.
function findBlobBfs(tile) {
  var original = tile;
  tile = Tile.cache(tile);

  var visited = {};
  var here = southeast(tile);
  if (!here) { return null; }

  var blob = {
    top: here[0],
    left: here[1],
    bottom: here[0],
    right: here[1],
  };

  var queue = [here];
  while (queue.length != 0) {
    var here = queue.shift();
    var row = here[0], col = here[1];

    if (visited[here]) continue;
    visited[here] = true;

    if (!tile(row, col)) continue;

    if (row < blob.top)   blob.top = row;
    if (col < blob.left)  blob.left = col;
    if (col > blob.right) blob.right = col;

    queue.push([row - 1, col]); // north
    queue.push([row + 1, col]); // south    
    queue.push([row, col + 1]); // east
    queue.push([row, col - 1]); // west    
  }

  return {blob: blob, cache: tile, tile: original};
}


// findBlobConcentric(tile: Tile) -> {
//   blob: {top, left, bottom, right},
//   tile: Tile,
//   cache: {hits: int, misses: int, reads: []{location, value, hit}}
// }
//
// Returns the bounding box of the first blob it encounters,
// along with the tile it operated on and some statistics about
// its internal cache, used to minimize requests to the underlying
// tile.
//
// This algorithm works by scanning for any live pixel, then
// performing a concentric fill. This was my first attempt at improving
// on BFS. I first wrote something very much like the outlining algorithm
// above, but it would walk out onto long one pixel wide piers and
// then refuse to come back. My first solution was to say, "okay," and
// implement stack based backtracking.
//
// Alas, I never came up with a good termination condition for this approach,
// so it just concentricly scans the whole blob. I'm keeping it in as a
// curiosity and for the visualization. I like the pattern it makes.
function findBlobConcentric(tile) {
  var original = tile;
  tile = Tile.cache(tile);

  var visited = {};
  var here = southeast(tile, visited);

  if (!here) { return null; }  // couldn't find a blob.

  var blob = {
    top: here[0],
    left: here[1],
    bottom: here[0],
    right: here[1],
  };

  var frame = {
    scan: west.clockwise,
    i: 0,
    here: here,
  }

  var stack = [frame];
  while (stack.length !== 0) {
    var fr = stack[stack.length - 1];
    var here = fr.here, scan = fr.scan;
    visited[here] = true;

    var row = here[0], col = here[1];
    if (row < blob.top)   blob.top = row;
    if (col < blob.left)  blob.left = col;
    if (col > blob.right) blob.right = col;

    if (fr.i++ < directions.length) {
      var there = [here[0] + scan[0], here[1] + scan[1]]
      if (!visited[there] && tile(there[0], there[1])) {
        var call = {
          here: there,
          scan: scan.clockwise,
          i: 0,
        }
        stack.push(call);
      }     
      fr.scan = scan.ccwise;
    } else {
      stack.pop();
    }
  }

  return {blob: blob, cache: tile, tile: original};  
}

// analyze(tile) -> []Blob
// struct Blob {
//   top: int
//   left: int
//   right: int
//   bottom: int
//   cells: [][row, col]
// }
//
// Returns all blobs on the tile. This always scans every
// pixel exactly once.
function analyze(tile) {
  var cells = {};
  var r = tile.rows; while (--r >= 0) {
    var c = tile.cols; while (--c >= 0) {
      if (tile(r, c)) {
        var southNeighbor = cells[[r + south[0], c + south[1]]];
        var eastNeighbor = cells[[r + east[0], c + east[1]]];
        var blob = merge(southNeighbor, eastNeighbor);
        // No neighbors :(
        if (!blob) {
          blob = {
            top: r,
            bottom: r,
            left: c,
            right: c,
            cells: [[r, c]]
          }
        } else {
          blob.top = Math.min(r, blob.top);
          blob.left = Math.min(c, blob.left);
          blob.right = Math.max(c, blob.right);
          blob.bottom = Math.max(r, blob.bottom);
          blob.cells.push([r, c]);
        }
        cells[[r, c]] = blob;
      }
    }
  }

  // merge(a: Blob, b: Blob) -> Blob
  //   Merge two blobs and update the cells list.
  //   This merges the second blob into the first.
  //   If either a or b is undefined, returns the
  //   other without modifying cells.
  function merge(a, b) {
    if (!a) return b;
    if (!b) return a;
    if (a === b) return a;
    a.top = Math.min(a.top, b.top);
    a.left = Math.min(a.left, b.left);
    a.right = Math.max(a.right, b.right);
    a.bottom = Math.max(a.bottom, b.bottom);
    a.cells = a.cells.concat(b.cells);
    for (var cell in cells) {
      if (cells[cell] === b) {
        cells[cell] = a;
      }
    }
    return a;
  }

  // Collect and return unique blobs.
  var blobs = [];
  for (var cell in cells) {
    var blob = cells[cell];
    if (blobs.indexOf(blob) == -1)
      blobs.push(blob);
  }
  return blobs;
}


// north, south, east, west: [drow, dcol]
// Cardinal directions constants. They're in a ring, so
// north.clockwise === east and east.ccwise === north.
//
// These make our navigational code easier to read.
//
// This is a bit repetitive, and we don't actually need
// all these constants in this program, but I like the
// completeness.
var north = [-1, 0],
    west = [0, -1],  // west
    south = [1, 0],  // south
    east = [0, 1]; // east

north.clockwise = east;
east.clockwise = south;
south.clockwise = west;
west.clockwise = north;

north.clockwise.ccwise = north;
south.clockwise.ccwise = south;
east.clockwise.ccwise = east;
west.clockwise.ccwise = west;

var directions = [north, south, east, west];


// struct Tile {
//   @apply(row: int, col: int) => bool
//   set(row: int, col: int, value) => bool
//     - mutates Tile
//   rows: int
//   cols: int
//   reads: [][row: int, col: int]
//   writes: []{location: [row: int, col: int], value}
// }
//
// Tiles represent an underlying 2d boolean array and record
// accesses to it.
//
// You use the Tile() function to make Tiles. This returns
// the object; it isn't a constructor.
//
// A Tile is an object with these properties:
//
// tile = Tile('001\n101\n111');  // or with 2d array
// tile.rows   // => 3
// tile.cols   // => 3
// tile(0, 2); // => true
// tile.reads  // => [[0, 2]]
//
// recorder = tile.record();
// recorder(0, 0); recorder(1, 1);
// recorder.reads  // => [[0, 0], [1, 1]]
function Tile(aryOrStr) {
  if (typeof aryOrStr === 'string') {
    var ary = parseBinaryStrToAry2d(aryOrStr);
  } else {
    var ary = aryOrStr;
  }

  // We can't use the constructor function / prototype pattern
  // because Tiles are themselves functions, and you can't
  // overload function apply in a prototype--you have to start
  // with the function you want.
  //
  // I decided to make Tiles functions for the aesthetics of
  // it--tile(row, col) looks quite nice. The cost of the closure
  // seemed worth it for this exercise. In bigger programs, I
  // usually end up falling back to uglier syntax--tile.at(row, col)
  // that leads to a bit more traditional code.
  var tile = function(row, col) {
    if (row < 0 || row >= tile.rows) return null;
    if (col < 0 || col >= tile.cols) return null;
    tile.reads.push([row, col]);
    return ary[row][col];
  };

  tile.reads = [];
  tile.writes = [];
  tile.rows = ary.length;
  tile.cols = ary[0].length; // assuming rows of identical length

  tile.set = function(row, col, value) {
    if (row < 0 || row >= tile.rows) return null;
    if (col < 0 || col >= tile.cols) return null;
    tile.writes.push({location: [row, col], value: value});
    return ary[row][col] = value;
  };

  tile.record = function() {
    return Tile(ary);
  }

  tile.toString = function() {
    var rows = [];
    for (var r = 0; r != tile.rows; ++r) {
      var row = [];
      for (var c = 0; c != tile.cols; ++c) {
        row.push(ary[r][c]? '1' : '0')
      }
      rows.push(row.join('  '));
    }
    return rows.join('\n');
  }

  return tile;
}

// parseBinaryStrToAry2d(str) -> [][]bool
//   Parses a string of '0' and '1' into a 2d array of bools. Ignores empty
//   lines and symbols which aren't 0 or 1.
function parseBinaryStrToAry2d(str) {
  return str.split('\n').map(function (line) {
    return line.replace(/[^01]+/g, '').split('').map(function (ch) {
      return ch === '1';
    });
  }).filter(function(row) {
    return row && row.length > 0;
  });
}

// If this were a real emergency, underscore or something would 
// give us this.
function clamp(val, min, max) {
  if (val < min) return min;
  if (val > max) return max;
  return val;
}

// Tile.random(width=10, height=10, mass=1.0) -> Tile
//   Generates a tile with a random blob on it. The blob is guaranteed
//   to be a blob (that is, connected by cardinal direction adjacent
//   pixels). Mass is a scaling factor for the number of pixels in
//   the blob (adjust to taste).
Tile.random = function(width, height, mass) {
  width = width || 10;
  height = height || 10;
  mass = mass || 1.0;

  var ary = [];
  var r = height; while (--r >= 0) {
    ary.push(new Array(width));
  }

  var here = [clamp(Math.floor(Math.random() * height), 0, height - 1),
              clamp(Math.floor(Math.random() * width), 0, width - 1)];

  var points = width * height * Math.random();
  while (--points >= 0) {
    ary[here[0]][here[1]] = 1;
    var bearing = directions[Math.floor(Math.random() * directions.length)] || north;
    here[0] += bearing[0]
    here[1] += bearing[1]
    // Clamp.
    here[0] = clamp(here[0], 0, height - 1);
    here[1] = clamp(here[1], 0, width - 1);    
  }

  return Tile(ary);
}

// Tile.cache(tile: Tile) -> Tile
//
//   Returns a tile which caches reads from its underlying tile.
//   Writes are not supported. Records cache statistics (.hits, .misses, .reads)
Tile.cache = function(tile) {
  var cache = {};

  var cacher = function() {    
    var args = Array.prototype.slice.call(arguments);
    var key = args.toString();
    if (typeof cache[args] == 'undefined') {
      cache[args] = tile.apply(this, args);
      ++cacher.misses;
    } else {
      ++cacher.hits;
    }
    cacher.reads.push(args);
    return cache[args];
  };

  cacher.rows = tile.rows;
  cacher.cols = tile.cols;
  cacher.hits = 0;
  cacher.misses = 0;
  cacher.reads = [];

  return cacher;
};

// southeast(tile: Tile, visited={}) -> [row, col]
//   Returns the coordinates of the southeast corner of tile,
//   and updates visited with [row, col] => true for each
//   position it's scanned.
function southeast(tile, visited) {
  visited = visited || {};
  var row = tile.rows; while (--row >= 0) {
    var col = tile.cols; while (--col >= 0) {
      if (tile(row, col)) {
        return [row, col];
      } else {
        // We know there's nothing here.
        visited[[row, col]] = true;
      }
    }
  } 
}

module.exports = {
  Tile: Tile,
  find: {
    byOutline: findBlobOutline,
    byBfs: findBlobBfs,
    byConcentric: findBlobConcentric,
  },
  analyze: analyze,
};
},{}],2:[function(require,module,exports){
var blob = require('./blob.js');

var proto = Object.create(HTMLElement.prototype);

proto.createdCallback = function() {
  // Workaround for web components method call issues.
  this.random = proto.random;
}

proto.attachedCallback = function() {
  this.tile = blob.Tile(this.textContent);
  this.setup();
  this.update();

  this.addEventListener('mousedown', onMouseDown);
  this.addEventListener('mouseover', onMouseOver);
  this.addEventListener('click', onClick);
};

proto.detachedCallback = function() {
  this.removeEventListener('mousedown', onMouseDown);
  this.removeEventListener('mouseover', onMouseOver);
  this.removeEventListener('click', onClick);
}

function onClick(evt) {
  var t = evt.target;
  if (t.algorithm) {
    console.log('toggling', t.algorithm);    
    this.classList.toggle(t.algorithm + '-off');
  }
}

function toggleAlive(td) {
  var r = td.row, c = td.col;
  var tile = td.inspector.tile;
  tile.set(r, c, !tile(r, c));
  td.inspector.update();  
}

function onMouseDown(evt) {
  if ('row' in evt.target) {
    toggleAlive(evt.target);
  }
}

function onMouseOver(evt) {
  if ((evt.buttons === 1 || evt.buttons === 3) && 'row' in evt.target) {
    toggleAlive(evt.target);
  }
}

function addHighlight(td, kind) {
  td.highlights = td.highlights || {};
  var hl = document.createElement('div');
  hl.classList.add('tile-highlight');
  hl.classList.add('tile-highlight-' + kind);
  td.highlights[kind] = hl;
  td.appendChild(hl);
  return hl;
}

function addLabel(td) {
  if (!td.label) {
    var lbl = document.createElement('div');
    lbl.classList.add('tile-label');
    td.label = lbl;
    td.appendChild(lbl);
  }
  return td.label;
}

proto.setup = function() {
  this.innerHTML = '';
  this.initPanels();
  this.initTable();
};

proto.random = function() {
  this.tile = blob.Tile.random(10, 10);
  this.setup();
  this.update();
};

proto.initTable = function() {
  var rows = this.tile.rows, cols = this.tile.cols;
  var table = document.createElement('table');
  var cellNodes = [];
  for (var r = 0; r != rows; ++r) {
    var tr = document.createElement('tr')
    var cellRow = [];
    for (var c = 0; c != cols; ++c) {      
      var td = document.createElement('td');
      td.setAttribute('class', 'tile-' + r + '_' + c);
      td.inspector = this;
      addHighlight(td, 'outline');
      addHighlight(td, 'bfs');
      addHighlight(td, 'concentric');
      addLabel(td);
      tr.appendChild(td);
      cellRow.push(td);
    }
    table.appendChild(tr);
    cellNodes.push(cellRow);
  }
  this.table = table;
  this.cells = cellNodes;

  this.tableContainer.innerHTML = '';
  this.tableContainer.appendChild(table);
};

proto.initPanels = function() {
  var stats = document.createElement('div');
  stats.classList.add('stats')
  this.stats = stats;
  this.appendChild(stats);

  var tc = document.createElement('div');
  tc.classList.add('table-container');
  this.tableContainer = tc;
  this.appendChild(tc);
};

function indexReads(reads) {
  var index = {};
  var i = reads.length; while (--i >= 0) {
    index[reads[i]] = index[reads[i]] || []
    index[reads[i]].unshift(i);
  }
  return index;
}

function setHighlights(td, results) {
  for (algo in td.highlights) {
    var hl = td.highlights[algo];
    hl.classList.remove('highlight-on');
    hl.style.animationDelay = 0;
    hl.style.webkitAnimationDelay = 0;
  }
  // So it's come to this.
  //
  // This terrible kludge is because the CSS animations won't
  // restart if we remove and add the .highlight-on class in the same
  // tick.
  //
  // I suspect there's a poorly-supported API somewhere that will make
  // this all better someday.
  setTimeout(function() {
    for (var algo in results) {
      var index = results[algo].index;
      var readIdx = index[[td.row, td.col]];
      var hl = td.highlights[algo];
      if (typeof readIdx !== 'undefined' && readIdx.length > 0) {
        hl.classList.add('highlight-on');
        hl.style.animationDelay = 0.1 * readIdx[readIdx.length - 1] + 's';
        hl.style.webkitAnimationDelay = 0.1 * readIdx[readIdx.length - 1] + 's';
      }
    }
  }, 13);
}

proto.update = function() {
  var results = {
    outline: blob.find.byOutline(this.tile.record()),
    bfs: blob.find.byBfs(this.tile.record()),
    concentric: blob.find.byConcentric(this.tile.record()),
  };

  for (algo in results) {
    if (results[algo]) {
      results[algo].index = indexReads(results[algo].tile.reads);
    } else {
      delete results[algo];
    }
  }

  this.results = results;

  var rows = this.tile.rows, cols = this.tile.cols;
  for (var r = 0; r != rows; ++r) {
    for (var c = 0; c != cols; ++c) {
      var td = this.cells[r][c];
      td.row = r;
      td.col = c;
      if (this.tile(r, c)) {
        td.label.textContent = 1;
        td.classList.add('tile-high');
        td.classList.remove('tile-low');
      } else {
        td.label.textContent = 0;
        td.classList.add('tile-low');
        td.classList.remove('tile-high');
      }
      setHighlights(td, results);
    }
  }

  this.updateStats();
};

function makeRow(columns) {
  var tr = document.createElement('tr');
  for (var i = 0; i != arguments.length; ++i) {
    var td = document.createElement('td');
    var col = arguments[i];
    if (typeof col === 'string') {
      td.textContent = col;
    } else {
      for (var prop in arguments[i]) {
        td[prop] = arguments[i][prop];
      }
    }
    tr.appendChild(td);
  }
  return tr;
}

function deepAssign(node, field, value) {
  node[field] = value;
  var i = node.children.length;
  while (--i >= 0) {
    deepAssign(node.children[i], field, value);
  }
}

proto.updateStats = function() {
  this.stats.innerHTML = '';
  for (algo in this.results) {
    var table = document.createElement('table');
    table.classList.add('stats-table-' + algo);
    var result = this.results[algo];
    var hdr = makeRow('Algorithm', algo);
    hdr.classList.add('stats-header-algo-' + algo);
    table.appendChild(hdr);


    table.appendChild(makeRow('blob:', JSON.stringify(result.blob, null, 4)));
    table.appendChild(makeRow('reads:', result.tile.reads.length + ''));
    table.appendChild(makeRow('cache:', result.cache.hits + ' hits; ' + result.cache.misses + ' misses.'));
    deepAssign(table, 'inspector', this);
    deepAssign(table, 'algorithm', algo);
    this.stats.appendChild(table);
  }
};


module.exports = {
  TileInspector: document.registerElement('tile-inspector', {prototype: proto}),
};
},{"./blob.js":1}]},{},[2]);
