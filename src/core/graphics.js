nessy.graphics = (() => {
	var g = {};
	
	["clearRect", "fillRect", "strokeRect",
	 "fillText", "strokeText", "measureText",
	 "drawImage",
	 "save", "restore"].forEach(name => {
		var func = CanvasRenderingContext2D.prototype[name];
		if (typeof func === "undefined") throw "Not Found";
		g[name] = (canvas, ...args) => func.call(canvas.getContext("2d"), ...args);
	});
	
	["clearRect", "fillRect", "strokeRect"].forEach(name => {
		g[name] = nessy.func(g[name])
			.map((func, canvas, rect) => func(canvas, rect.x, rect.y, rect.width, rect.height))
			.value;
	});
	
	["fillText", "strokeText"].forEach(name => {
		g[name] = nessy.func(g[name])
			.map((func, canvas, text, point, maxWidth) => func(canvas, text, point.x, point.y, maxWidth))
			.value;
	});
	
	["drawImage"].forEach(name => {
		g[name] = nessy.func(g[name])
			.map((func, canvas, image, sourceRect, destRect) => {				
				if (typeof destRect === "undefined") {
					destRect = sourceRect;
					sourceRect = { x: 0, y: 0, width: image.width, height: image.height };
				}
				
				return func(
					canvas, image,
					sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height,
					destRect.x, destRect.y, destRect.width, destRect.height);
			})			
			.value;
	});
	
	g.getBounds = canvas => ({ x: 0, y: 0, width: canvas.width, height: canvas.height });
	
	g.sandbox = (canvas, callback) => {
		g.save(canvas);
		callback(canvas);
		g.restore(canvas);			
	};
	
	return g;
})();

nessy.Graphics = function(host, bounds) {
	this.host = host;
	
	this.width = bounds.width;
	this.height = bounds.height;

	var canvas = this.newCanvas();
	var div = document.createElement("div");
	div.style.margin = "200 auto 0 auto";
	div.style.width = bounds.width;
	div.appendChild(canvas);
	document.body.appendChild(div);

	this.canvas = canvas;
};

nessy.Graphics.prototype = {
	draw: function() {
		nessy.graphics.clearRect(this.__canvas, nessy.graphics.getBounds(this.__canvas));
	},
	get canvas() {
		return this.__canvas;
	},
	set canvas(value) {
		this.__canvas = value;
		this.context = this.__canvas.getContext("2d");
	},

	createImage: function(width, height, callback) {
		var previous = this.canvas;
		var canvas = this.newCanvas(width, height);
		this.canvas = canvas;

		callback();

		this.canvas = previous;
		return canvas;
	},

	newCanvas: function(width, height) {
		width = width || this.width;
		height = height || this.height;

		var canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		return canvas;
	},

	clear: function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	print: function(text, x, y) {
		this.context.font = "bold 12pt Consolas";
		this.context.fillText(text, x, y);
	},
	drawImage: function(texture, x, y) {
		this.context.drawImage(texture, x, y);
	},
	drawLine: function(line) {
		this.context.beginPath();
		this.context.moveTo(line.from.x, line.from.y);
		this.context.lineTo(line.to.x, line.to.y);
		this.context.stroke();
	},

	fill: function() {
		this.context.fill();
	},
	rect: function(rect) {
		this.context.rect(rect.x, rect.y, rect.width, rect.height);
	},
	strokeRect: function(rect) {
		this.context.strokeRect(rect.x, rect.y, rect.width, rect.height);
	},
	fillRect: function(rect) {
		this.context.fillRect(rect.x, rect.y, rect.width, rect.height);
	},
	createPattern: function(image, repeat) {
		return this.context.createPattern(image, repeat);
	},
	get viewport() {
		return { x: 0, y: 0, width: this.canvas.width, height: this.canvas.height };
	},
	get strokeStyle() { return this.context.strokeStyle; },
	set strokeStyle(style) { this.context.strokeStyle = style; },
	get fillStyle() { return this.context.fillStyle; },
	set fillStyle(style) { this.context.fillStyle = style; },
};