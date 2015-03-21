define(["nessy/nessy"], function(nessy) {

	var sprites = {
		water: new nessy.spritesheet("resources/water.png").sprite()
	}

	var zIndex = 0

	function Water() {
		this.bounds = nessy.graphics.viewport()

		this.texture = {
			sprite: sprites.water
		}
	}

	Water.prototype.load = function(callback) {
		
	}

	return Water
})