nessy.debug = true

nessy.load = function() {
	this.water = new Water()

	nessy.add(["update"], function(entity) { entity.update() })
}

var d = repeat(serial(delay(3), func(function() { console.log("after 3 sec") })))()

nessy.update = function() {
	var dr = d.next({ delta: nessy.timer.delta })
}

nessy.draw = function() {
	for (var entity of nessy.entities.where(drawable)) {
		nessy.renderer.draw(entity)
	}
}

var drawable = function(entity) {
	return entity.texture != null
}

nessy.run()