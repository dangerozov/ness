nessy.GameLoop = function() {
	this.updates = []
	this.draws = []
}

nessy.GameLoop.prototype = {
	plugger: function(plugin) {
		if (plugin.update != null) {
			this.updates.push(plugin.update.bind(plugin))
		}
		if (plugin.draw != null) {
			this.draws.push(plugin.draw.bind(plugin))
		}
	},
	run: function() {
		var update = function(elapsedTotal) {
			window.requestAnimationFrame(update.bind(this))
			nessy.utils.forEach(this.updates, function(func) {
				func(elapsedTotal)
			})
			nessy.utils.forEach(this.draws, function(draw) {
				draw(elapsedTotal)
			})
		}

		window.requestAnimationFrame(update.bind(this))
	}
}