define(function() {

	function Timer() {
		this.previous = 0
		this.delta = 0
	}

	Timer.prototype.update = function(elapsedTotal) {
		this.delta = (elapsedTotal - this.previous) / 1000
		this.previous = elapsedTotal
	}

	return Timer
})