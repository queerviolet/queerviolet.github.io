// inkPad < HTMLElement
var inkPad = Object.create(HTMLElement.prototype);

function swatch(parent, cssClass) {
	var swatch = parent.querySelector('x-swatch.' + cssClass);
	if (swatch) {
		return swatch;
	}
	swatch = document.createElement('x-swatch');
	swatch.setAttribute('class', cssClass);
	parent.appendChild(swatch);
	return swatch;
}

var swatchProto = Object.create(HTMLElement.prototype);

swatchProto.attachedCallback = function() {
	this.style.display = 'block';
	this.cstyle = window.getComputedStyle(this);
}

swatchProto.css = function(property, units) {
	var value = this.cstyle[property];
	if (units !== undefined && value.endsWith(units)) {
		return value.substr(0, value.length - units.length);
	}
	return value;
}
document.registerElement('x-swatch', {prototype: swatchProto});


inkPad.createdCallback = function() {
	var canvas = document.createElement('canvas');
	canvas.height = this.clientHeight;
	canvas.width = this.clientWidth;
	canvas.style.position = 'absolute';
	canvas.style.left = 0;
	canvas.style.right = 0;
	canvas.style.top = 0;
	canvas.style.bottom = 0;
	canvas.style.zIndex = 1000;
	this.canvas = canvas;
	this.appendChild(this.canvas);

	this.cstyle = window.getComputedStyle(this);
	this.ctx = this.canvas.getContext('2d');	

	var drawing = false;
	this.pen = swatch(this, 'pen');
	this.path = [];
	var x, y;
	this.addEventListener('mousedown', function(event) {
		drawing = true;
		x = event.offsetX;
		y = event.offsetY;
//		this.path.push({f: this.ctx.moveTo, ctx: this.ctx, args: [event.offsetX, event.offsetY]});
		//this.ctx.moveTo(event.offsetX, event.offsetY);
	});
	this.addEventListener('mousemove', function(event) {
		if (drawing) {
			this.path.push({
				f: function(x, y, x2, y2) {
					this.ctx.beginPath();
					this.ctx.moveTo(x, y);
					this.ctx.lineTo(x2, y2);
					this.ctx.stroke();
				},
				ctx: this,
				args: [x, y, event.offsetX, event.offsetY]
			});
			x = event.offsetX;
			y = event.offsetY;
		}
	});
	this.addEventListener('mouseup', function(event) {
		drawing = false;
	});

	this.frame = this.frame.bind(this);
	requestAnimationFrame(this.frame);	
}

inkPad.frame = function() {
	this.ctx.fillStyle = this.cstyle.backgroundColor;
	this.ctx.globalAlpha = 0.2;
	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
	this.ctx.globalAlpha = 1.0;

	this.ctx.lineWidth = this.pen.css('width', 'px');
	this.ctx.strokeStyle = this.pen.css('color');
	this.ctx.beginPath();
//	for (var i = 0; i < this.path.length; ++i) {
	while (this.path.length > 0) {
		var cmd = this.path.pop();
		cmd.f.apply(cmd.ctx, cmd.args);
	}
	this.ctx.stroke();

	window.requestAnimationFrame(this.frame);
};

document.registerElement('ink-pad', {prototype: inkPad});