nessy.GameLoop = function() {
	this.preloads = []
	this.inits = []
	this.updates = []
	this.draws = []
}

nessy.GameLoop.prototype = {
	plugger: function(plugin) {
		if (plugin.preload != null) {
			this.preloads.push(plugin.preload.bind(plugin))
		}
		if (plugin.init != null) {
			this.inits.push(call(plugin.init.bind(plugin)))
		}
		if (plugin.update != null) {
			this.updates.push(plugin.update.bind(plugin))
		}
		if (plugin.draw != null) {
			this.draws.push(plugin.draw.bind(plugin))
		}
	},
	run: function() {
				
		var preload = serial(this.preloads.concat(this.inits))()
		var finishedPreloading = false
		
		var update = function(elapsedTotal) {
			window.requestAnimationFrame(update.bind(this))
			
			if (finishedPreloading || (finishedPreloading = preload())) {
				nessy.utils.forEach(this.updates, function(func) {
					func(elapsedTotal)
				})
				nessy.utils.forEach(this.draws, function(draw) {
					draw(elapsedTotal)
				})
			}
		}

		window.requestAnimationFrame(update.bind(this))
	}
}