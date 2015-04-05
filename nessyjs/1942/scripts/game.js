nessy.load = function() {
	this.image = (new nessy.Spritesheet("img_the_scream.jpg"))
		.sprite(new nessy.Rectangle(0, 0, 220, 277))
	this.image.position = new nessy.Point(10, 10)

	this.water = new Water()

	this.line = new nessy.Line({ x: 100, y: 100 }, new nessy.Point(300, 100))
}

nessy.update = function() { }

nessy.draw = function() {
	nessy.graphics.clear()
	this.image.draw(this.image.position)
	this.line.draw()

	nessy.renderer.draw(this.water)

	//nessy.graphics.print(1 / nessy.timer.delta)
}

nessy.run()