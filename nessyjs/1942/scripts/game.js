require(["nessy/nessy", "./water"], function(nessy, Water) { 

	nessy.load = function(callback) {
		this.image = new nessy.spritesheet("img_the_scream.jpg", callback)
		this.image = this.image.sprite()

		//var water = new Water()
	};

	nessy.update = function() { }

	nessy.draw = function() {
		nessy.graphics.clear()
		this.image.draw(new nessy.point(10, 10))
		//host.graphics.print(1 / host.timer.delta)
	}

	nessy.run()
})

