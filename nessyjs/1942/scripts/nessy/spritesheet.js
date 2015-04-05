nessy.Sprite = function(spritesheet, bounds) {
	this.spritesheet = spritesheet
	this.bounds = bounds
}

nessy.Sprite.prototype = {
	draw: function(point, scale) {
		point = point || nessy.Point.zero
		scale = scale || nessy.Point.one

		if (this.spritesheet.raw.loaded)
			nessy.graphics.draw(this.spritesheet.raw, point.x, point.y)

		/*if (this.spritesheet.raw.loaded) {

			this.bounds = this.bounds || this.spritesheet.bounds

			nessy.graphics.draw(
				this.spritesheet.raw,
				0,
				0,
				this.spritesheet.raw.width,
				this.spritesheet.raw.height,
				point.x,
				point.y,
				scale.x * this.spritesheet.raw.width,
				scale.y * this.spritesheet.raw.height)
		}*/
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