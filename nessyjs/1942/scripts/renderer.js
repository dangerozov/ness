nessy.Renderer = function() {
	this.basis = new nessy.Point(0, 0)
	this.location = new nessy.Point(0, 0)
	this.scale = new nessy.Point(0, 0)
}

nessy.Renderer.prototype = {
	draw: function(entity) {
		var texture = entity.texture
		var mode = texture.mode || "scale"
		var source = texture.sprite.bounds
		var target = (texture.bounds || source).copy()
		target.location = target.location.add(entity.bounds.location)

		var scale = target.size.div(source.size)

		if (mode == "fill") {
			for (var x = target.x; x < target.x + scale.x * source.width; x += source.width) {
				for (var y = target.y; y < target.y + scale.y * source.height; y += source.height) {
					entity.texture.sprite.draw(new nessy.Point(x, y))
				};
			};
		}
		else if (mode == "scale") {
			entity.texture.sprite.draw(target.location, scale)
		}

		if (nessy.debug) {
			target.draw("red")
			entity.bounds.draw("green")
		}
	}
}

nessy.renderer = new nessy.Renderer()