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
			var image = nessy.graphics.createImage(target.width, target.height, function() {
				var pattern = nessy.graphics.createPattern(entity.texture.sprite.spritesheet.raw, "repeat")
				nessy.graphics.viewport.fill(pattern)
			})
			nessy.graphics.draw(image, target.x, target.y)
		}
		else if (mode == "scale") {
			entity.texture.sprite.draw(target.location, scale)
		}

		if (nessy.debug) {
			target.stroke("red")
			entity.bounds.stroke("green")
		}
	}
}

nessy.renderer = new nessy.Renderer()