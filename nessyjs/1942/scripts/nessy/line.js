nessy.Line = function(from, to) {
	from = nessy.Point.cast(from)
	to = nessy.Point.cast(to)

	this.from = from
	this.to = to

	console.log("new line "/* + this*/)
}

nessy.Line.prototype = {
	draw: function() {
		nessy.graphics.drawLine(this)
	},
	toString: function() {
		return "{ from: " + this.from + ", to: " + this.to + " }";
	}
}