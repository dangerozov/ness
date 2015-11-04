Water = function(host) {
	this.host = host;
	this.bounds = host.graphics.viewport;
	this.texture = {
		image: images.water,
		mode: "fill"
	};

	this.texture.bounds = host.graphics.viewport;
	this.texture.bounds.height += 24;

	this.update = Water.scrolling;

	host.entities.add(this);
};

var renderFill = (sprite, canvas) => {
	var pattern = nessy.graphics.createPattern(canvas, sprite.image, "repeat");
	
	nessy.graphics.sandbox(canvas, canvas => {
		canvas.getContext("2d").fillStyle = pattern;
		nessy.graphics.fillRect(canvas, nessy.graphics.getBounds(canvas));
	});
};

var waterScrolling = (water) => {
	var task = water.host.moco.repeat(water.host.moco.serial([
		water.host.moco.nextFrame(),
		water.host.moco.delay(1 / 48),
		water.host.moco.call(() => { 
			water.texture.bounds.y = water.texture.bounds.y + 1;
			if (water.texture.bounds.y >= 0) {
				water.texture.bounds.y = -24;
			}
		})]))();

	return function() { task(); };
};

var host2 = new nessy.Host();
host2.plug("gameloop", nessy.GameLoop);
host2.plug("timer", nessy.Timer);
host2.plug("graphics", nessy.Graphics, { width: window.innerWidth, height: window.innerHeight });
host2.plug("renderer", nessy.Renderer);
host2.plug("keyboard", nessy.Keyboard);
host2.plug("mouse", nessy.Mouse);
host2.plug("entities", nessy.EntityStore);
host2.plug("moco", nessy.moco);

host2.debug = true;

var images = {};

var Game = function(host) {
	this.host = host;
	
	this.preload = this.host.moco.serial([
		this.host.moco.loadImage("resources/plane.png", img => images.plane = img),
		this.host.moco.loadImage("resources/water.png", img => images.water = img)
	]);
};

Game.prototype = {	
	init: function() {
		
		var water = {
			image: images.water,
			position: { x: 0, y: 0 },
			visible: true,
			fill: true
		};
		
		var plane = {
			image: images.plane,
			position: { x: 0, y: 0 },
			visible: true
		};
		
		plane.position = nessy.rectangle(nessy.sprite.getBounds(plane))
			.setCenter(nessy.rectangle.getCenter(nessy.graphics.getBounds(this.host.graphics.canvas)))
			.getTopLeft();

		this.host.entities.add(water);
		this.host.entities.add(plane);

		var canvas = this.host.graphics.canvas;

		this.host.entities.onUpdate(["update"], function(entity) { entity.update(); });
		this.host.entities.onDraw(["image", "position", "visible"], entity => nessy.sprite.render(entity, canvas));
		this.host.entities.onDraw(["image", "position", "visible", "fill"], entity => renderFill(entity, canvas));

		this.plane = plane;
		this.water = water;
	},	
	update: function() {
		if (this.host.keyboard.isDown(39)) this.plane.position.x += 10;
		if (this.host.keyboard.isDown(37)) this.plane.position.x -= 10;
		if (this.host.keyboard.isDown(40)) this.plane.position.y += 10;
		if (this.host.keyboard.isDown(38)) this.plane.position.y -= 10;
	},	
	draw: function() {
		
		if (this.host.keyboard.isDown(13)) {
			this.host.graphics.fillStyle = "white";
			this.host.graphics.print("pEnter pressed", 200, 200);
		}
		if (this.host.mouse.isDown) {
			this.host.graphics.fillStyle = "white";
			this.host.graphics.print("pMouse pressed", this.host.mouse.x + 2, this.host.mouse.y + 2);
		}
	}
};

host2.plug("game", Game);

host2.gameloop.run();