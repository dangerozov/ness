nessy.Renderer = function() {
	this.tempPoint = new nessy.Point(0, 0)
	this.tempScale = new nessy.Point(0, 0)
}

nessy.Renderer.prototype = {
	draw: function(entity) {
		var texture = entity.texture
		var mode = texture.mode || "scale"
		var source = texture.sprite.bounds
		var target = texture.bounds || source

		var x = target.x
		var y = target.y
		x += entity.bounds.x
		y += entity.bounds.y

		this.tempPoint.x = x
		this.tempPoint.y = y

		var xScale = target.width / source.width
		var yScale = target.height / source.height

		this.tempScale.x = xScale
		this.tempScale.y = yScale

		if (mode == "fill") {
			for (var x = target.x; x < target.x + xScale * source.width; x += source.width) {
				for (var y = target.y; y < target.y + yScale * source.height; y += source.height) {
					this.tempPoint.x = x
					this.tempPoint.y = y
					entity.texture.sprite.draw(this.tempPoint)
				};
			};
			entity.texture.sprite.draw(this.tempPoint, this.tempScale)
		}
		else if (mode == "scale") {
			entity.texture.sprite.draw(this.tempPoint, this.tempScale)
		}
	},

	isForMe: function(entity) {
		return entity.texture != null;
	}
}

nessy.renderer = new nessy.Renderer()