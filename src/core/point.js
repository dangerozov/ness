nessy.Point = function(host) {
	var Point = function(x, y) {
		this.x = x || 0
		this.y = y || 0
		
		//console.log("new point "/* + this*/)
	}
	
	Point.prototype = {	
		add: function(point) {
			return new host.Point(this.x + point.x, this.y + point.y)
		},
		sub: function(point) {
			return new host.Point(this.x - point.x, this.y - point.y)
		},
		div: function(point) {
			return new host.Point(this.x / point.x, this.y / point.y)
		},
		mul: function(point) {
			return new host.Point(this.x * point.x, this.y * point.y)
		},
		toString: function() {
			return "{ x: " + this.x + ", y: " + this.y + " }";
		}
	}
	
	Point.cast = function(obj) {
		if (obj instanceof host.Point)
			return obj
	
		return new host.Point(obj.x, obj.y)
	}
	
	Point.zero = new Point(0, 0)
	Point.one = new Point(1, 1)
	
	return Point
}