nessy.Texture = function(host) {
	var Texture = function(texture, bounds) {
		if (!(texture instanceof Image)) throw "Not Image"
		
		this.raw = texture
		this.bounds = bounds || new host.Rectangle({ width: texture.width, height: texture.height })
	}
	
	Texture.prototype = {
		draw: function(point, scale) {
			point = point || host.Point.zero
			scale = scale || host.Point.one
	
			host.graphics.drawImage(this.raw, point.x, point.y)
		}
	}
	
	return Texture
}

nessy.Sprite = function(host) {
	var Sprite = function(args) {
		if (!(args.texture instanceof host.Texture)) throw "Not Texture"
		
		this.texture = args.texture
		this.position = args.position || host.Point.zero
		this.scale = args.scale || host.Point.one
		if (args.hasOwnProperty("visible")) {
			Object.defineProperty(this, "visible", {
				get: function() { return args.visible }
			})
		}
		else {
			this.visible = true
		}
	}
	
	Sprite.prototype = {
		draw: function(args) {
			if (args.visible && this.visible) {
				var absolutePosition = args.position.add(this.position)
				host.graphics.drawImage(this.texture.raw, absolutePosition.x, absolutePosition.y)
			}
		},
		get bounds() {
			return new host.Rectangle({ x: this.position.x, y: this.position.y, width: this.texture.bounds.width, height: this.texture.bounds.height })
		}
	}
	
	return Sprite
}

nessy.CompositeSprite = function(host) {
	var CompositeSprite = function(args) {
		this.sprites = args.sprites
		this.position = args.position || host.Point.zero
		this.scale = args.scale || host.Point.one
		this.visible = args.visible || true
	}
	
	CompositeSprite.prototype = {
		draw: function() {
			if (this.visible) {
				this.sprites.forEach(function(sprite) {
					sprite.draw(this)
				}.bind(this))
			}
		},
		get bounds() {
			var bounds = this.sprites
				.map(function(sprite) { return sprite.bounds })
				.aggregate(host.Rectangle.join)

			bounds.location = this.position
			return bounds
		}
	}
	
	return CompositeSprite
}