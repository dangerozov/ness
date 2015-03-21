define(["./rectangle"], function(Rectangle) {

	function Graphics() {
		var canvas = document.createElement("canvas")
		canvas.width = 800
		canvas.height = 600
		document.body.appendChild(canvas)

		var context = canvas.getContext("2d")

		this.canvas = canvas
		this.context = context
	}

	Graphics.prototype.clear = function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
	}

	Graphics.prototype.print = function(text) {
		this.context.font = "italic 40pt Calibri"
		this.context.fillText(text, 150, 100)
	}

	Graphics.prototype.draw = function(texture, x, y) {
		this.context.drawImage(texture, 10, 10)
	}

	Graphics.prototype.viewport = function() {
		return new Rectangle(0, 0, this.canvas.width, this.canvas.height)
	}

	return Graphics
})