nessy.Rectangle = function(x, y, width, height) {
	this._location = new nessy.Point()
	this._size = new nessy.Point()

	this.x = x || 0
	this.y = y || 0
	this.width = width || 0
	this.height = height || 0

	//console.log("new rectangle "/* + this*/)
}

nessy.Rectangle.prototype = {
	get x() {
		return this._x
	},
	set x(value) {
		this._x = value
		this._location.x = this._x
	},
	get y() {
		return this._y
	},
	set y(value) {
		this._y = value
		this._location.y = this._y
	},
	get width() {
		return this._width
	},
	set width(value) {
		this._width = value
		this._size.x = this._width
	},
	get height() {
		return this._height
	},
	set height(value) {
		this._height = value
		this._size.y = this._height
	},

	get size() {
		return this._size
	},
	set size(point) {
		this.width = point.x
		this.height = point.y

		this._size.x = this.width
		this._size.y = this.height
	},

	get location() {
		return this._location
	},
	set location(point) {
		this.set("location", point)
	},

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
		nessy.graphics.drawRect(this, color)
	},
	toString: function() {
		return "{ x: " + this.x + ", y: " + this.y + ", w: " + this.width + ", h: " + this.height + " }"
	}
}