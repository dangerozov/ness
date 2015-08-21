Water = function(host) {

	this.bounds = host.graphics.viewport
	this.texture = {
		sprite: sprites.water,
		mode: "fill"
	}

	this.texture.bounds = host.graphics.viewport
	this.texture.bounds.height += 24

	this.update = Water.scrolling(this)

	host.entities.add(this)
}

Water.scrolling = function(self) {
	var task = repeat(serial([
		nextFrame(),
		delay(1 / 48),
		call(function() { 
			self.texture.bounds.y = self.texture.bounds.y + 1
			if (self.texture.bounds.y >= 0) {
				self.texture.bounds.y = -24
			}
		})]))()

	return function() { task() }
}