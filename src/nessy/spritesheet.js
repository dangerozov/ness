nessy.Sprite = function(spritesheet, bounds) {
	this.spritesheet = spritesheet
	this.bounds = bounds || spritesheet.bounds
}

nessy.Sprite.prototype = {
	draw: function(point, scale) {
		point = point || nessy.Point.zero
		scale = scale || nessy.Point.one

		nessy.graphics.drawImage(this.spritesheet.raw, point.x, point.y)
	}	
}

nessy.Spritesheet = function(image) {
	if (!(image instanceof Image)) throw "Not Image"
	
	this.raw = image
	this.bounds = new nessy.Rectangle(image.width, image.height)
}

nessy.Spritesheet.prototype = {
	sprite: function(bounds) {
		return new nessy.Sprite(this, bounds)
	}
}