nessy.load = function() {
	this.image = (new nessy.Spritesheet("img_the_scream.jpg"))
		.sprite(new nessy.Rectangle(0, 0, 220, 277))
	this.image.position = new nessy.Point(10, 10)

	this.water = new Water()

	this.line = new nessy.Line({ x: 100, y: 100 }, new nessy.Point(300, 100))
}

var d = delay(0.1)

nessy.update = function() {
	for (var entity of nessy.entities.where(updateable)) {
		entity.update()
	}

	var dr = d.next(nessy.timer.delta)
}

nessy.draw = function() {
	this.image.draw(this.image.position)
	this.line.draw()

	/*_.chain(nessy.entities)
		.filter(function(e) {
			return e.texture != null
		})
		.each(nessy.renderer.draw)
		.value()*/

	for (var entity of nessy.entities.where(drawable)) {
		nessy.renderer.draw(this.water)
	}

	//nessy.graphics.print(1 / nessy.timer.delta)
}

var updateable = function(entity) {
	return entity.update != null
}

var drawable = function(entity) {
	return entity.texture != null
}

nessy.run()