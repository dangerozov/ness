Water = function() {

	this.bounds = nessy.graphics.viewport
	this.texture = {
		sprite: Water.sprites.water,
		mode: "fill"
	}

	this.texture.bounds = nessy.graphics.viewport

	this.update = Water.scroll

	nessy.entities.add(this)
}

Water.scroll = function() {
	this.bounds.y = this.bounds.y + 1
	if (this.bounds.y > 24) {
		this.bounds.y = 0
	}
}

Water.sprites = {
	water: (new nessy.Spritesheet("resources/water.png"))
		.sprite(new nessy.Rectangle(0, 0, 24, 24))
}

function* delay(time) {
	var elapsed = 0
	while (elapsed < time) {
		var delta = yield null
		elapsed += delta
	}
}