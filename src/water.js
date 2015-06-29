var nessy = nessy || {};

Water = function() {

	this.bounds = nessy.graphics.viewport
	this.texture = {
		sprite: Water.sprites.water,
		mode: "fill"
	}

	this.texture.bounds = nessy.graphics.viewport
	this.texture.bounds.height += 24

	this.update = Water.scrolling(this)

	nessy.entities.add(this)
}

Water.scrolling = function(self) {
	var task = repeat(serial(
		delay(1 / 48),
		func(function() { 
			self.texture.bounds.y = self.texture.bounds.y + 1 
			if (self.texture.bounds.y >= 0) {
				self.texture.bounds.y = -24
			}
		})))()

	return function() {
		task.next({ delta: nessy.timer.delta })
	}
}

Water.sprites = {
	water: (new nessy.Spritesheet("resources/water.png")).sprite(new nessy.Rectangle(24, 24))
}