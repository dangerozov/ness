/*nessy.debug = true

nessy.load = function() {
	this.water = new Water()
	this.plane = {
		bounds: nessy.sprites.plane.bounds.copy(),
		texture: {
			sprite: nessy.sprites.plane
		}
	}
	this.plane.bounds.center = nessy.graphics.viewport.center
	nessy.entities.add(this.plane)

	nessy.add(["update"], function(entity) { entity.update() })
	nessy.add(["texture"], function(entity) { nessy.renderer.draw(entity) })

}

var d = repeat(serial(delay(3), func(function() { console.log("after 3 sec") })))()
var p = repeat(serial(delay(1/48), func(function() {
	nessy.plane.bounds.x += 1
})))()

nessy.update = function() {
	//var dr = p.next({ delta: nessy.timer.delta })

	if (nessy.keyboard.isDown(39)) this.plane.bounds.x += 10
	if (nessy.keyboard.isDown(37)) this.plane.bounds.x -= 10
	if (nessy.keyboard.isDown(40)) this.plane.bounds.y += 10
	if (nessy.keyboard.isDown(38)) this.plane.bounds.y -= 10
}

nessy.draw = function() {


	for (var entity of nessy.entities.where(drawable)) {
		nessy.renderer.draw(entity)
	}



	if (nessy.keyboard.isDown(13)) {
		nessy.graphics.fillStyle = "white"
		nessy.graphics.print("pEnter pressed", 200, 200)
		new nessy.Rectangle(200, 200).stroke()
	}
}

var drawable = function(entity) {
	return entity.texture != null
}

nessy.sprites = {
	plane: (new nessy.Spritesheet("resources/plane.png")).sprite(new nessy.Rectangle(24, 24))
}

nessy.run()*/