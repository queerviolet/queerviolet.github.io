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