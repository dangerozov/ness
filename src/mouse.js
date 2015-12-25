nessy.Mouse = function(host) {
	var canvas = host.graphics.canvas;

	this.isDown = false;
	this.x = 0;
	this.y = 0;

	canvas.addEventListener("mousedown", () => {
		this.isDown = true;
	});

	canvas.addEventListener("mouseup", () => {
		this.isDown = false;
	});

	canvas.addEventListener("mousemove", event => {
		var bounding = canvas.getBoundingClientRect();
		this.x = event.pageX - (window.pageXOffset + bounding.left);
		this.y = event.pageY - (window.pageYOffset + bounding.top);
	});
};