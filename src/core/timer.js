nessy.Timer = function() {
	this.total = 0;
	this.delta = 0;
};

nessy.Timer.prototype = {
	update: function(elapsedTotal) {
		this.delta = (elapsedTotal - this.total) / 1000;
		this.total = elapsedTotal;
	}
};