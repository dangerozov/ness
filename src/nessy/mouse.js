nessy.Mouse = function() {
	var canvas = nessy.graphics.canvas	

	this.isDown = false
	this.x = 0
	this.y = 0

	canvas.addEventListener("mousedown", function(event) {
		this.isDown = true		
	}.bind(this))

	canvas.addEventListener("mouseup", function() {
		this.isDown = false
	}.bind(this))

	canvas.addEventListener("mousemove", function(event) {
		var bounding = canvas.getBoundingClientRect()
		this.x = event.pageX - (window.pageXOffset + bounding.left)
		this.y = event.pageY - (window.pageYOffset + bounding.top)
	}.bind(this))
}