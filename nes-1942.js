Water = function(host) {
	this.host = host;
	this.bounds = host.graphics.viewport;
	this.texture = {
		image: textures.water,
		mode: "fill"
	};

	this.texture.bounds = host.graphics.viewport;
	this.texture.bounds.height += 24;

	this.update = Water.scrolling.bind(this)();

	host.entities.add(this);
};

Water.scrolling = function() {
	var task = this.host.moco.repeat(this.host.moco.serial([
		this.host.moco.nextFrame(),
		this.host.moco.delay(1 / 48),
		this.host.moco.call(() => { 
			this.texture.bounds.y = this.texture.bounds.y + 1;
			if (this.texture.bounds.y >= 0) {
				this.texture.bounds.y = -24;
			}
		})]))();

	return function() { task(); };
};

var host2 = new nessy.Host();
host2.plug("gameloop", nessy.GameLoop);
host2.plug("timer", nessy.Timer);
host2.plug("Point", nessy.Point);
host2.plug("Rectangle", nessy.Rectangle);
host2.plug("graphics", nessy.Graphics, { width: 800, height: 600 });
host2.plug("Texture", nessy.Texture);
host2.plug("renderer", nessy.Renderer);
host2.plug("keyboard", nessy.Keyboard);
host2.plug("mouse", nessy.Mouse);
host2.plug("entities", nessy.EntityStore);
host2.plug("moco", nessy.moco);

host2.debug = true;

var textures = {};

var Game = function(host) {
	this.host = host;
	
	this.preload = this.host.moco.serial([
		this.host.moco.loadImage("resources/plane.png", img => { 
			textures.plane = (new this.host.Texture(img));
		}),
		this.host.moco.loadImage("resources/water.png", img => {
			textures.water = (new this.host.Texture(img));
		})
	]);
};

Game.prototype = {	
	init: function() {
		
		var water = new Water(this.host);
		var plane = {
			bounds: textures.plane.bounds,
			texture: {
				image: textures.plane
			}
		};
		plane.bounds = this.host.Rectangle
			.setCenter(plane.bounds, this.host.Rectangle
				.getCenter(this.host.graphics.viewport));

		this.host.entities.add(plane);

		this.host.entities.onUpdate(["update"], function(entity) { entity.update(); });
		this.host.entities.onDraw(["texture"], function(entity) { this.host.renderer.render(entity); }.bind(this));

		this.plane = plane;
		this.water = water;
	},	
	update: function() {
		if (this.host.keyboard.isDown(39)) this.plane.bounds.x += 10;
		if (this.host.keyboard.isDown(37)) this.plane.bounds.x -= 10;
		if (this.host.keyboard.isDown(40)) this.plane.bounds.y += 10;
		if (this.host.keyboard.isDown(38)) this.plane.bounds.y -= 10;
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