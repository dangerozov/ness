Water = function() {

	this.bounds = nessy.graphics.viewport
	this.texture = {
		sprite: Water.sprites.water,
		mode: "fill"
	}

	this.texture.bounds = nessy.graphics.viewport

	this.update = Water.scrolling(this)

	nessy.entities.add(this)
}

Water.scrolling = function(self) {
	var task = repeat(serial(
		delay(1 / 48),
		func(function() { 
			self.texture.bounds.y = self.texture.bounds.y + 1 
			if (self.texture.bounds.y > 24) {
				self.texture.bounds.y = 0
			}
		})))()

	return function() {
		task.next({ delta: nessy.timer.delta })
	}
}

Water.sprites = {
	water: (new nessy.Spritesheet("resources/water.png"))
		.sprite(new nessy.Rectangle(0, 0, 24, 24))
}

function delay(time) {
	return function*() {
		var elapsed = 0
		while (true) {
			var context = yield

			elapsed += context.delta
			context.delta = 0
			if (elapsed >= time) {
				context.delta = elapsed - time
				break
			}
		}
	}
}

function func(func) {
	return function*() {
		func()
	}
}

function serial(createLeft, createRight) {
	return function*() {
		var left = createLeft()
		var right = createRight()
		while (true) {
			var context = yield

			var result
			do {
				result = left.next(context)
			}
			while(!result.done && context.delta > 0)

			if (result.done) {
				do {
					result = right.next(context)
				}
				while(!result.done && context.delta > 0)
			}

			if (result.done) {
				break;
			}
		}
	}
}

function repeat(createTask) {
	return function*() {
		var task = createTask()
		while(true) {
			var context = yield

			do {
				var result
				do {
					result = task.next(context)
				}
				while(!result.done && context.delta > 0)

				if (result.done) {
					task = createTask()
				}
			}
			while(context.delta > 0)
		}
	}
}