define(["../require"], function(require) { 

	var nessy = function() { return require("./nessy") }

	function Sprite(spritesheet, bounds) {
		this.spritesheet = spritesheet
		this.bounds = bounds
	}

	Sprite.prototype.draw = function(point, scale) {
		point = point || nessy().point()
		scale = scale || nessy().point(1, 1)

		nessy().graphics.draw(
			this.spritesheet.raw,
			this.bounds.x,
			this.bounds.y,
			this.bounds.width,
			this.bounds.height,
			point.x,
			point.y,
			scale.x * this.bounds.width,
			scale.y * this.bounds.height)
	}

	function Spritesheet(path, callback) {
		var raw = new Image()
		raw.onload = callback
		raw.src = path

		this.raw = raw
		this.bounds = nessy().rectangle(0, 0, raw.width, raw.height)
	}

	Spritesheet.prototype.sprite = function(bounds) {
		bounds = bounds || this.bounds
		var sprite = new Sprite(this, bounds)
		return sprite
	}

	return Spritesheet
})