var nessy = nessy || {};

nessy.Rectangle = function(x, y, width, height) {
	if (width == null && height == null) {
		this.x = 0
		this.y = 0
		this.width = x
		this.height = y
	}
	else {
		this.x = x || 0
		this.y = y || 0
		this.width = width || 0
		this.height = height || 0
	}

	//console.log("new rectangle "/* + this*/)
}

nessy.Rectangle.prototype = {
	get left() { return this.x }, 
	set left(value) { this.x = value },

	get right() { return this.x + this.width },
	set right(value) { this.x = value - this.width },

	get top() { return this.y },
	set top(value) { this.y = value },

	get bottom() { return this.y + this.height },
	set bottom(value) { this.y = value - this.height },

	get size() { return new nessy.Point(this.width, this.height) },
	set size(point) {
		this.width = point.x
		this.height = point.y
	},

	get location() { return new nessy.Point(this.left, this.top) },
	set location(point) { this.set("location", point) },

	get topCenter() { return new nessy.Point(this.center.x, this.top) },
	set topCenter(point) { this.set("topCenter", point) },

	get topRight() { return new nessy.Point(this.right, this.top) },
	set topRight(point) { this.set("topRight", point) },

	get middleLeft() { return new nessy.Point(this.left, this.center.y) },
	set middleLeft(point) { this.set("middleLeft", point) },

	get center() { return new nessy.Point(this.x + this.width / 2, this.y + this.height / 2) },
	set center(point) { this.set("center", point) },

	get middleRight() { return new nessy.Point(this.right, this.center.y) },
	set middleRight(point) { this.set("middleRight", point) },

	get bottomLeft() { return new nessy.Point(this.left, this.bottom) },
	set bottomLeft(point) { this.set("bottomLeft", point) },

	get bottomCenter() { return new nessy.Point(this.center.x, this.bottom) },
	set bottomCenter(point) { this.set("bottomCenter", point) },

	get bottomRight() { return new nessy.Point(this.right, this.bottom) },
	set bottomRight(point) { this.set("bottomRight", point) },

	set: function(anchor, point) {
		var anchorValue = this[anchor]
		var offsetX = point.x - anchorValue.x
		var offsetY = point.y - anchorValue.y
		this.x += offsetX
		this.y += offsetY
	},

	copy: function() {
		return new nessy.Rectangle(this.x, this.y, this.width, this.height)
	},

	draw: function(color) {
		var previousStyle = nessy.graphics.strokeStyle
		nessy.graphics.strokeStyle = color
		nessy.graphics.drawRect(this)
		nessy.graphics.strokeStyle = previousStyle
	},
	toString: function() {
		return "{ x: " + this.x + ", y: " + this.y + ", w: " + this.width + ", h: " + this.height + " }"
	}
}