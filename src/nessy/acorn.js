/*var nessy = {
	run: function(options) {
		options.init()
		var update = function(elapsedTotal) {
			window.requestAnimationFrame(update)
			options.update(elapsedTotal)
		}

		window.requestAnimationFrame(update)
	}
}

// caching elapsedTotal
nessy.run({
	init: function() {
		nessy.timer = new nessy.Timer()
	},
	update: function(elapsedTotal) { 
		nessy.timer.update(elapsedTotal)
	}
})

// graphics
nessy.run({
	init: function() {
		nessy.graphics = new nessy.Graphics()
		nessy.draw = function() {}
	},
	update: function() {
		nessy.graphics.clear()
		nessy.draw()
	}
})

// entities
nessy.run({
	init: function() {
		nessy.entities = new nessy.EntityStore()
		nessy.systems = new Array()
		nessy.add = function(components, callback) {
			nessy.systems.push({ components: components, callback: callback })
		}
	},
	update: function() {
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
	}
})*/

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