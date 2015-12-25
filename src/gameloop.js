nessy.GameLoop = function(host) {
	this.host = host;
	this.preloads = [];
	this.inits = [];
	this.updates = [];
	this.draws = [];
};

nessy.GameLoop.prototype = {
	plugger: function(plugin) {
		if (plugin.preload !== undefined) {
			this.preloads.push(plugin.preload.bind(plugin));
		}
		if (plugin.init !== undefined) {
			this.inits.push(this.host.moco.call(plugin.init.bind(plugin)));
		}
		if (plugin.update !== undefined) {
			this.updates.push(plugin.update.bind(plugin));
		}
		if (plugin.draw !== undefined) {
			this.draws.push(plugin.draw.bind(plugin));
		}
	},
	run: function() {

		var preload = this.host.moco.serial(this.preloads.concat(this.inits))();
		var finishedPreloading = false;
		
		var update = elapsedTotal => {
			window.requestAnimationFrame(update);
			
			if (finishedPreloading || (finishedPreloading = preload())) {
				this.updates.forEach(func => func(elapsedTotal));
				this.draws.forEach(draw => draw(elapsedTotal));
			}
		};

		window.requestAnimationFrame(update);
	}
};