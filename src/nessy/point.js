nessy.Point = function(x, y) {
	this.x = x || 0
	this.y = y || 0
	
	//console.log("new point "/* + this*/)
}

nessy.Point.prototype = {

	add: function(point) {
		return new nessy.Point(this.x + point.x, this.y + point.y)
	},
	sub: function(point) {
		this.x -= point.x
		this.y -= point.y
	},
	div: function(point) {
		return new nessy.Point(this.x / point.x, this.y / point.y)
	},
	mul: function(point) {
		this.x *= point.x
		this.y *= point.y
	},
	set: function(point) {
		this.x = point.x
		this.y = point.y
		return this
	},
	toString: function() {
		return "{ x: " + this.x + ", y: " + this.y + " }";
	}
}

nessy.Point.cast = function(obj) {
	if (obj instanceof nessy.Point)
		return obj

	return new nessy.Point(obj.x, obj.y)
}

nessy.Point.zero = new nessy.Point(0, 0)
nessy.Point.one = new nessy.Point(1, 1)