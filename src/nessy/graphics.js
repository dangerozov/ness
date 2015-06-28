nessy.Graphics = function() {
	this.width = 800
	this.height = 600

	var canvas = this.newCanvas()
	document.body.appendChild(canvas)

	this.canvas = canvas

	this.clear()
}

nessy.Graphics.prototype = {
	get canvas() {
		return this.__canvas
	},
	set canvas(value) {
		this.__canvas = value
		this.context = this.__canvas.getContext("2d")
	},

	createImage: function(width, height, callback) {
		var previous = nessy.graphics.canvas
		var canvas = nessy.graphics.newCanvas(width, height)
		nessy.graphics.canvas = canvas

		callback()

		nessy.graphics.canvas = previous
		return canvas
	},

	newCanvas: function(width, height) {
		width = width || this.width
		height = height || this.height

		var canvas = document.createElement("canvas");
		canvas.width = width
		canvas.height = height
		return canvas
	},

	clear: function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
	},
	print: function(text, x, y) {
		this.context.font = "bold 12pt Consolas"
		this.context.fillText(text, x, y)
	},
	draw: function(texture, x, y) {
		this.context.drawImage(texture, x, y)
	},
	drawLine: function(line) {
		this.context.beginPath()
		this.context.moveTo(line.from.x, line.from.y)
		this.context.lineTo(line.to.x, line.to.y)
		this.context.stroke()
	},

	fill: function() {
		this.context.fill()
	},
	rect: function(rect) {
		this.context.rect(rect.x, rect.y, rect.width, rect.height)
	},
	strokeRect: function(rect) {
		this.context.strokeRect(rect.x, rect.y, rect.width, rect.height)
	},
	fillRect: function(rect) {
		this.context.fillRect(rect.x, rect.y, rect.width, rect.height)
	},
	createPattern: function(image, repeat) {
		return this.context.createPattern(image, repeat)
	},
	get viewport() {
		return new nessy.Rectangle(this.canvas.width, this.canvas.height)
	},
	get strokeStyle() { return this.context.strokeStyle },
	set strokeStyle(style) { this.context.strokeStyle = style },
	get fillStyle() { return this.context.fillStyle },
	set fillStyle(style) { this.context.fillStyle = style },
}