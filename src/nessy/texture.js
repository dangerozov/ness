nessy.Texture = function(host) {
	var Texture = function(texture, bounds) {
		if (!(texture instanceof Image)) throw "Not Image"
		
		this.raw = texture
		this.bounds = bounds || new host.Rectangle(texture.width, texture.height)
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
		this.visible = args.visible || function() { return true }
	}
	
	Sprite.prototype = {
		draw: function(args) {
			if (args.visible() && this.visible()) {
				var absolutePosition = args.position.add(this.position)
				host.graphics.drawImage(this.texture.raw, absolutePosition.x, absolutePosition.y)
			}
		},
		getBounds: function() {
			return new host.Rectangle(this.position.x, this.position.y, this.texture.bounds.width, this.texture.bounds.height)
		}
	}
	
	return Sprite
}

nessy.CompositeSprite = function(host) {
	var CompositeSprite = function(args) {
		this.sprites = args.sprites
		this.position = args.position || host.Point.zero
		this.scale = args.scale || host.Point.one
		this.visible = args.visible || function() { return true }
	}
	
	CompositeSprite.prototype = {
		draw: function() {
			if (this.visible()) {
				this.sprites.forEach(function(sprite) {
					sprite.draw(this)
				}.bind(this))
			}
		},
		getBounds: function() {
			var spritesBounds = this.sprites
				.map(function(sprite) {
					return sprite.getBounds()
				})
				.aggregate(
				{
					lefts: [],
					rights: [],
					tops: [],
					bottoms: []
				},
				function(result, bounds) {
					result.lefts.push(bounds.left)
					result.rights.push(bounds.right)
					result.tops.push(bounds.top)
					result.bottoms.push(bounds.bottom)
					return result
				})
			
			var left = spritesBounds.lefts
				.min(spritesBounds.lefts[0])
			var right = spritesBounds.rights
				.max(spritesBounds.rights[0])
			var top = spritesBounds.tops
				.min(spritesBounds.tops[0])
			var bottom = spritesBounds.bottoms
				.max(spritesBounds.bottoms[0])
				
			var bounds = new host.Rectangle(left, top, right - left, bottom - top)
			bounds.location = this.position
			return bounds
		}
	}
	
	return CompositeSprite
}