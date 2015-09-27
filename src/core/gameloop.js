nessy.GameLoop = function(host) {
	this.host = host
	this.preloads = []
	this.inits = []
	this.updates = []
	this.draws = []
};

nessy.GameLoop.prototype = {
	plugger: function(plugin) {
		if (plugin.preload != null) {
			this.preloads.push(plugin.preload.bind(plugin))
		}
		if (plugin.init != null) {
			this.inits.push(this.host.moco.call(plugin.init.bind(plugin)))
		}
		if (plugin.update != null) {
			this.updates.push(plugin.update.bind(plugin))
		}
		if (plugin.draw != null) {
			this.draws.push(plugin.draw.bind(plugin))
		}
	},
	run: function() {
				
		var preload = this.host.moco.serial(this.preloads.concat(this.inits))()
		var finishedPreloading = false
		
		var update = function(elapsedTotal) {
			window.requestAnimationFrame(update.bind(this))
			
			if (finishedPreloading || (finishedPreloading = preload())) {
				this.updates.forEach(function(func) {
					func(elapsedTotal)
				});
				this.draws.forEach(function(draw) {
					draw(elapsedTotal)
				})
			}
		}

		window.requestAnimationFrame(update.bind(this))
	}
}