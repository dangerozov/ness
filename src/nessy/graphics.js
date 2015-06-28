nessy.Graphics = function() {
	var canvas = document.createElement("canvas")
	canvas.width = 800
	canvas.height = 600
	document.body.appendChild(canvas)

	var context = canvas.getContext("2d")

	this.canvas = canvas
	this.context = context

	this.context.strokeStyle = "black"
}

nessy.Graphics.prototype = {
	clear: function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
	},
	print: function(text) {
		this.context.font = "italic 40pt Calibri"
		this.context.fillText(text, 150, 100)
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
	drawRect: function(rect) {
		this.context.beginPath()
		this.context.lineWidth = "1"
		this.context.rect(rect.x, rect.y, rect.width, rect.height)
		this.context.stroke()
	},
	get viewport() {
		return new nessy.Rectangle(0, 0, this.canvas.width, this.canvas.height)
	},
	get strokeStyle() { return this.context.strokeStyle },
	set strokeStyle(style) { this.context.strokeStyle = style },
}