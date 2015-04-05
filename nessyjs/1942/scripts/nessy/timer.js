nessy.Timer = function() {
	this.previous = 0
	this.delta = 0
}

nessy.Timer.prototype = {
	update: function(elapsedTotal) {
		nessy.timer.delta = (elapsedTotal - nessy.timer.previous) / 1000
		nessy.timer.previous = elapsedTotal	
	}
}