var nessy = {
	run: function() {
		nessy.timer = new nessy.Timer()
		nessy.graphics = new nessy.Graphics()

		nessy.load()

		var update = function(elapsedTotal) {
			window.requestAnimationFrame(update)

			nessy.timer.update(elapsedTotal)
			nessy.update()
			nessy.graphics.clear()
			nessy.draw()
		}

		window.requestAnimationFrame(update)
	},

	load: function() {},
	update: function() {},
	draw: function() {}
}