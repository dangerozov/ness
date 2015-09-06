nessy.Keyboard = function() {
	var map = []
	document.addEventListener("keydown", function(event) {
		map[event.keyCode] = true
	})
	
	document.addEventListener("keyup", function(event) {
		map[event.keyCode] = false
	})

	this.map = map
}

nessy.Keyboard.prototype = {
	isDown: function(keyCode) {
		return this.map[keyCode] || false
	}
}