nessy.debug = true

nessy.load = function() {
	this.water = new Water()
}

var d = repeat(serial(delay(3), func(function() { console.log("after 3 sec") })))()

nessy.update = function() {
	for (var entity of nessy.entities.where(updateable)) {
		entity.update()
	}

	var dr = d.next({ delta: nessy.timer.delta })
}

nessy.draw = function() {
	for (var entity of nessy.entities.where(drawable)) {
		nessy.renderer.draw(entity)
	}
}

var updateable = function(entity) {
	return entity.update != null
}

var drawable = function(entity) {
	return entity.texture != null
}

nessy.run()