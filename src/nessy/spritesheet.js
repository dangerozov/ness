nessy.Sprite = function(spritesheet, bounds) {
	this.spritesheet = spritesheet
	this.bounds = bounds
}

nessy.Sprite.prototype = {
	draw: function(point, scale) {
		if (this.spritesheet.raw.loaded)
			this.draw = this.drawLoaded
	},
	drawLoaded: function(point, scale) {
		point = point || nessy.Point.zero
		scale = scale || nessy.Point.one

		nessy.graphics.draw(this.spritesheet.raw, point.x, point.y)
	}	
}

nessy.Spritesheet = function(path) {
	this.raw = new Image()
	this.raw.loaded = false
	var spritesheet = this
	this.raw.onload = function() {
		this.loaded = true
	}
	this.raw.src = path
}

nessy.Spritesheet.prototype = {
	sprite: function(bounds) {
		return new nessy.Sprite(this, bounds)
	}
}