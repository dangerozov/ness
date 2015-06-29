var nessy = {
	run: function() {
		nessy.timer = new nessy.Timer()
		nessy.graphics = new nessy.Graphics()
		nessy.keyboard = new nessy.Keyboard()

		nessy.systems = new Array()

		nessy.load()

		var update = function(elapsedTotal) {
			window.requestAnimationFrame(update)

			nessy.timer.update(elapsedTotal)
			nessy.updateSystems()
			nessy.update()
			nessy.graphics.clear()
			nessy.draw()
		}

		window.requestAnimationFrame(update)
	},

	add: function(components, callback) {
		nessy.systems.push({ components: components, callback: callback })
	},

	updateSystems: function() {
		for (var entity of nessy.entities) {
			for (var system of nessy.systems) {
				var suitable = true
				for (var component of system.components) {
					suitable = entity[component] != null
				}
				if (suitable) {
					system.callback(entity)
				}
			}
		}
	},

	load: function() {},
	update: function() {},
	draw: function() {}
}