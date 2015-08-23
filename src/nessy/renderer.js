nessy.Renderer = function(host) {
	this.host = host
}

nessy.Renderer.prototype = {
	render: function(entity) {
		var texture = entity.texture
		var mode = texture.mode || "scale"
		var source = texture.image.bounds
		var target = (texture.bounds || source).copy()
		target.location = target.location.add(entity.bounds.location)

		var scale = target.size.div(source.size)

		if (mode == "fill") {
			var image = this.host.graphics.createImage(target.width, target.height, function() {
				var pattern = this.host.graphics.createPattern(entity.texture.image.raw, "repeat")
				this.host.graphics.viewport.fill(pattern)
			}.bind(this))
			this.host.graphics.drawImage(image, target.x, target.y)
		}
		else if (mode == "scale") {
			entity.texture.image.draw(target.location, scale)
		}

		if (this.host.debug) {
			target.stroke("red")
			entity.bounds.stroke("green")
		}
	}
}