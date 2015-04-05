Water = function() {

	this.bounds = nessy.graphics.viewport
	this.texture = {
		sprite: Water.sprites.water,
		mode: "fill"
	}

	this.texture.bounds = nessy.graphics.viewport

	nessy.entities.add(this)
}

Water.sprites = {
	water: (new nessy.Spritesheet("resources/water.png"))
		.sprite(new nessy.Rectangle(0, 0, 24, 24))
}
