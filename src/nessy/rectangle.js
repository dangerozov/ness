nessy.Rectangle = function(host) {
	var Rectangle = function(x, y, width, height) {
		if (width == undefined && height == undefined) {
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
	
	Rectangle.join = function(leftRect, rightRect) {
		var left = Math.min(leftRect.left, rightRect.left)
		var top = Math.min(leftRect.top, rightRect.top)
		var right = Math.max(leftRect.right, rightRect.right)
		var bottom = Math.max(leftRect.bottom, rightRect.bottom)
		
		return new Rectangle(left, top, right - left, bottom - top)
	}
	
	Rectangle.prototype = {
		get left() { return this.x }, 
		set left(value) { this.x = value },
	
		get right() { return this.x + this.width },
		set right(value) { this.x = value - this.width },
	
		get top() { return this.y },
		set top(value) { this.y = value },
	
		get bottom() { return this.y + this.height },
		set bottom(value) { this.y = value - this.height },
	
		get size() { return new host.Point(this.width, this.height) },
		set size(point) {
			this.width = point.x
			this.height = point.y
		},
	
		get location() { return new host.Point(this.left, this.top) },
		set location(point) { this.set("location", point) },
	
		get topCenter() { return new host.Point(this.center.x, this.top) },
		set topCenter(point) { this.set("topCenter", point) },
	
		get topRight() { return new host.Point(this.right, this.top) },
		set topRight(point) { this.set("topRight", point) },
	
		get middleLeft() { return new host.Point(this.left, this.center.y) },
		set middleLeft(point) { this.set("middleLeft", point) },
	
		get center() { return new host.Point(this.x + this.width / 2, this.y + this.height / 2) },
		set center(point) { this.set("center", point) },
	
		getCenter: function() {
			return this.center	
		},
		
		setCenter: function(point) {
			var result = this.copy()
			result.center = point
			return result	
		},
	
		get middleRight() { return new host.Point(this.right, this.center.y) },
		set middleRight(point) { this.set("middleRight", point) },
	
		get bottomLeft() { return new host.Point(this.left, this.bottom) },
		set bottomLeft(point) { this.set("bottomLeft", point) },
	
		get bottomCenter() { return new host.Point(this.center.x, this.bottom) },
		set bottomCenter(point) { this.set("bottomCenter", point) },
	
		get bottomRight() { return new host.Point(this.right, this.bottom) },
		set bottomRight(point) { this.set("bottomRight", point) },
	
		set: function(anchor, point) {
			var anchorValue = this[anchor]
			var offsetX = point.x - anchorValue.x
			var offsetY = point.y - anchorValue.y
			this.x += offsetX
			this.y += offsetY
		},
	
		intersects: function(rect) {
			return rect.top > this.top &&
				rect.top < this.bottom &&
				rect.left > this.left &&
				rect.left < this.right
		},
	
		copy: function() {
			return new host.Rectangle(this.x, this.y, this.width, this.height)
		},
	
		stroke: function(strokeStyle) {
			var previousStyle = host.graphics.strokeStyle
			host.graphics.strokeStyle = strokeStyle
			host.graphics.strokeRect(this)
			host.graphics.strokeStyle = previousStyle
		},
	
		fill: function(fillStyle) {
			var previousStyle = host.graphics.fillStyle
			host.graphics.fillStyle = fillStyle
			host.graphics.fillRect(this)
			host.graphics.fillStyle = previousStyle
		},
	
		toString: function() {
			return "{ x: " + this.x + ", y: " + this.y + ", w: " + this.width + ", h: " + this.height + " }"
		}
	}
	
	return Rectangle
}