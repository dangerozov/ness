nessy.Graphics = function() {
	var canvas = document.createElement("canvas")
	canvas.width = 800
	canvas.height = 600
	document.body.appendChild(canvas)

	var context = canvas.getContext("2d")

	this.canvas = canvas
	this.context = context

	this.viewport = new nessy.Rectangle(0, 0, this.canvas.width, this.canvas.height)
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
	}
}