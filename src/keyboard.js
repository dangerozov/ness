nessy.Keyboard = function() {
	var map = [];
	document.addEventListener("keydown", event => {
		map[event.keyCode] = true;
	});
	
	document.addEventListener("keyup", event => {
		map[event.keyCode] = false;
	});

	this.map = map;
};

nessy.Keyboard.prototype = {
	isDown: function(keyCode) {
		return this.map[keyCode] || false;
	}
};