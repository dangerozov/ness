define([
	"nessy/graphics",
	"nessy/point",
	"nessy/rectangle",
	"nessy/spritesheet",
	"nessy/timer",
	], function(Graphics, Point, Rectangle, Spritesheet, Timer) {

		var nessy = {
			point: Point,
			rectangle: Rectangle,
			spritesheet: Spritesheet,

			graphics: new Graphics(),
			timer: new Timer()
		}

		nessy.run = function() {
			nessy.load(function() { 
				window.requestAnimationFrame(update)
			})
		}

		function update(elapsedTotal) {
			window.requestAnimationFrame(update)

			nessy.timer.update(elapsedTotal)
			nessy.update()
			nessy.draw()
		}

		nessy.load = function() {}
		nessy.update = function() {}
		nessy.draw = function() {}

		return nessy
	}
)