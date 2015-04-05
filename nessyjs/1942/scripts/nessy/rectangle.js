nessy.Rectangle = function(x, y, width, height) {
	this.x = x || 0
	this.y = y || 0
	this.width = width || 0
	this.height = height || 0

	console.log("new rectangle "/* + this*/)
}

nessy.Rectangle.prototype = {

	get size() {
		return new nessy.Point(this.width, this.height)
	},
	set size(point) {
		this.width = point.x
		this.height = point.y
	},

	get location() {
		return new nessy.Point(this.x, this.y)
	},
	set location(point) {
		this.set("location", point)
	},




	set: function(anchor, point) {
		var anchorValue = this[anchor]
		var offset = point.sub(anchorValue)
		this.x += offset.x
		this.y += offset.y
	},

	copy: function() {
		return new nessy.Rectangle(this.x, this.y, this.width, this.height)
	},
	toString: function() {
		return "{ x: " + this.x + ", y: " + this.y + ", w: " + this.width + ", h: " + this.height + " }"
	}
}