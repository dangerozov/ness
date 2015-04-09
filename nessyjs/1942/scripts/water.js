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
	var delta = yield

	elapsed += delta
	if (elapsed >= delta) {
		var rest = elapsed - time
	}

	yield rest

	alert(elapsed)
}

function* func(func) {
	func()
}

function* serial(left, right) {
	while(true) {
		var delta = yield null;
		do {
			var leftResult = left.next(delta)
			delta = leftResult.value
		}
		while(leftResult.done == false && delta > 0)
	}


	do {
		var delta = yield null;
		var l = left.next(delta);
	}
	while(!l.done && delta > 0)

	do {
		var delta = yield null;
		var r = right.next(delta);
	}
	while(!r.done)
}