nessy.Renderer = function() {
	this.location = new nessy.Point(0, 0)
	this.scale = new nessy.Point(0, 0)
}

nessy.Renderer.prototype = {
	draw: function(entity) {
		var texture = entity.texture
		var mode = texture.mode || "scale"
		var source = texture.sprite.bounds
		var target = texture.bounds || source

		this.location
			.set(target.location)
			.add(entity.bounds.location)

		this.scale
			.set(target.size)
			.div(source.size)

		if (mode == "fill") {
			for (var x = target.x; x < target.x + this.scale.x * source.width; x += source.width) {
				for (var y = target.y; y < target.y + this.scale.y * source.height; y += source.height) {
					this.location.x = x
					this.location.y = y
					entity.texture.sprite.draw(this.location)
				};
			};
		}
		else if (mode == "scale") {
			entity.texture.sprite.draw(this.location, this.scale)
		}
	}
}

nessy.renderer = new nessy.Renderer()