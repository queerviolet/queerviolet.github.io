var width = 340, height = 220;
var padding = 200;
var boxWidth = width + 2 * padding, boxHeight = height + 2 * padding;
var viewBox = [-padding, -padding, boxWidth, boxHeight];
hoppity.setAttribute('viewBox', viewBox.join(' '));

var scale = 1.0;
hoppity.setAttribute('width', scale * boxWidth);
hoppity.setAttribute('height', scale * boxHeight);

var beat = 100;

function setattrs(element, attrs) {
    for (attr in attrs) {
	element.setAttribute(attr, attrs[attr]);
    }
    return element;
}

var SVG_NS = 'http://www.w3.org/2000/svg';
function tag(name, attrs) {
    var element = document.createElementNS(SVG_NS, name);
    return setattrs(element, attrs);
}

function hopSquare(x, y) {
    var rect = tag('rect', {
	x: x,
	y: y,
	width: 100,
	height: 100,
	rx: 10,
	ry: 10,
	fill: '#333',
	'fill-opacity': 0.5,
	stroke: '#333',
	opacity: 1,
	'stroke-width': 0,
	'stroke-opacity': 0.0,
    });
    hoppity.appendChild(rect);
    return rect;
}

hopSquare.all = [
    [0, 50],
    [120, 0],
    [120, 120],
    [240, 50],
].map((coords) => hopSquare.apply(null, coords));

SVGElement.prototype.anim = function(attrs) {
    var animate = tag('animate', attrs);
    setattrs(animate, {repeatCount: 'indefinite'})
    this.appendChild(animate);
    return animate;
}

SVGElement.prototype.keyFrame = function(ms, attr, value) {
    this._kf = this._kf || {};
    this._kf[attr] = this._kf[attr] || [];
    var frames = this._kf[attr];
    var frame = {time: ms, value: value, attr: attr}
    frames.push({time: ms, value: value, attr: attr});
    this._updateAnimations();
};


SVGElement.prototype._updateAnimations = function() {
    this.innerHTML = '';
    for (attr in this._kf) {
	var frames = this._kf[attr];
	var initial = this.getAttribute(attr);
	
	frames.sort((a, b) => a.time - b.time);
	if (frames[0].time !== 0) {
	    frames.unshift({time: 0, value: initial});
	}
	if (frames[frames.length - 1].time < dur) {
	    frames.push({time: dur, value: initial});
	}

	var times = frames.map((f) => f.time / dur)	    
	var values = frames.map((f) => f.value);
	var lastValue = values[values.length - 1];

	var speed = 1.0;
	this.anim({
	    attributeName: attr,
	    keyTimes: times.join(';'),
	    values: values.join(';'),
	    repeatCount: 'indefinite',
	    dur: dur / speed + 'ms',
	    begin: 0,
	});
    }
    
};



function pulse(element, attrs, begin, width) {
    var up = begin + beat;
    var down = up + (width || beat);
    var end = down + (hopSquare.all.length - 1) * 4 * beat;
    for (a in attrs) {
	var initial = element.getAttribute(a);
	var pulse = attrs[a];
	console.log(a, initial, pulse, begin);
	element.keyFrame(begin, a, initial);
	element.keyFrame(up, a, pulse);
	element.keyFrame(down, a, initial);
	element.keyFrame(end, a, initial);
    };
}

function footprint(color, x, y, time) {
    var size = 10;
    var print = tag('circle', {
	cx: x,
	cy: y,
	r: size,
	fill: color,
	opacity: 0,
	stroke: '#333',
	'stroke-width': 0,
    });
    pulse(print, {opacity: 1}, time, 4 * beat);

    var splash = tag('circle', {
	cx: x,
	cy: y,
	r: size,
	stroke: color,
	fill: color,
	'fill-opacity': 0.1,
	'stroke-width': 1,
	'stroke-opacity': 1,
	opacity: 0,
    });
    pulse(splash, {opacity: 0.9}, time, 4 * beat);
    pulse(splash, {'fill-opacity': 0.5}, time, 4 * beat);
    splash.keyFrame(time, 'r', size);
    splash.keyFrame(time + 6 * beat, 'r', 6 * size);
    
    
    hoppity.appendChild(print);
    hoppity.appendChild(splash);
}

var colors = ['#ccc', '#10A1CC', '#D61A64', '#EC7D23'];

var cycle = hopSquare.all.length * 5.9 * beat;
var dur = cycle * colors.length;
colors.forEach((color, i) => {
  var cycleBegin = cycle * i;
    hopSquare.all.map((square, j) => {
      var time = cycleBegin + 1.8 * beat * j;	
	pulse(square, {
	    fill: color,
	    stroke: color,
	    'stroke-opacity': 1.0,
	    'stroke-width': 2.0,
	}, time, 5 * beat);
      var x = square.x.baseVal.value,
	  y = square.y.baseVal.value,
	  w = square.width.baseVal.value,
	  h = square.height.baseVal.value;
      var randX = x + w * Math.random();
      var randY = y + h * Math.random();
      footprint(color, randX, randY, time);
  })
});

window.addEventListener('click', function() {
    var xml = new XMLSerializer();
    var src = new XMLSerializer().serializeToString(hoppity);
    var dataUri = 'data:image/svg+xml,' + encodeURIComponent(src)
    window.open(dataUri, 'save');
});
