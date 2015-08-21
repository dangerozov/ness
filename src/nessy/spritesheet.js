nessy.Spritesheet = function(host) {
	var Spritesheet = function(image) {
		if (!(image instanceof Image)) throw "Not Image"
	
		this.raw = image
		this.bounds = new host.Rectangle(image.width, image.height)
	}
	
	Spritesheet.prototype = {
		sprite: function(bounds) {
			return new host.Sprite(this, bounds)
		}
	}
	
	return Spritesheet
}

nessy.Sprite = function(host) {
	var Sprite = function(spritesheet, bounds) {
		this.spritesheet = spritesheet
		this.bounds = bounds || spritesheet.bounds
	}
	
	Sprite.prototype = {
		draw: function(point, scale) {
			point = point || host.Point.zero
			scale = scale || host.Point.one
	
			host.graphics.drawImage(this.spritesheet.raw, point.x, point.y)
		}
	}
	
	return Sprite
}