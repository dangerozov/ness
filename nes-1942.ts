import graphics = require("./src/graphics");
import rectangle = require("./src/rectangle-builder");
import sprite = require("./src/sprite");
import mouse = require("./src/mouse");
import entities = require("./src/entities");

let images: {
    water: HTMLImageElement,
    plane: HTMLImageElement
} = {
    water: null,
    plane: null
};

let Water = function(host: any) {
	this.host = host;
	this.bounds = host.graphics.viewport;
	this.texture = {
		image: images.water,
		mode: "fill"
	};

	this.texture.bounds = host.graphics.viewport;
	this.texture.bounds.height += 24;

	host.entities.add(this);
};

var renderFill = (sprite: any, canvas: HTMLCanvasElement) => {
	var bounds = graphics.getBounds(canvas);
	bounds.height += sprite.image.height;
	var wtr = graphics.create(bounds);
	var pattern = graphics.createPattern(wtr, sprite.image, "repeat");
	
	graphics.sandbox(wtr, wtr => {
		wtr.getContext("2d").fillStyle = pattern;
		graphics.fillRect(wtr, graphics.getBounds(wtr));
	});
	
	graphics.drawImage(canvas, wtr, sprite.position.x, sprite.position.y);
};

var waterScrolling = (water: any) => {
	var task = water.host.moco.repeat(water.host.moco.serial([
		water.host.moco.nextFrame(),
		water.host.moco.delay(1 / 48),
		water.host.moco.call(() => { 
			water.position.y = water.position.y + 1;
			if (water.position.y >= 0) {
				water.position.y = -24;
			}
		})]))();

	return function() { task(); };
};

declare let nessy: {
    Host: any,
    GameLoop: any,
    Timer: any,
    Renderer: any,
    Keyboard: any,
    moco: any
};

var host2 = new nessy.Host();
host2.plug("gameloop", nessy.GameLoop);
host2.plug("timer", nessy.Timer);
host2.plug("graphics", graphics.init(host2, { width: window.innerWidth, height: window.innerHeight }));
host2.plug("renderer", nessy.Renderer);
host2.plug("keyboard", nessy.Keyboard);
host2.plug("mouse", mouse.init(host2));
host2.plug("entities", entities.init());
host2.plug("moco", nessy.moco);

host2.debug = true;

var Game = function(host: any) {
	this.host = host;
	
	this.preload = this.host.moco.serial([
		this.host.moco.loadImage("resources/plane.png", (img: HTMLImageElement) => images.plane = img),
		this.host.moco.loadImage("resources/water.png", (img: HTMLImageElement) => images.water = img)
	]);
};

Game.prototype = {	
	init: function() {
		
		var water = {
			image: images.water,
			position: { x: 0, y: 0 },
			visible: true,
			fill: true,
			host: this.host
		};
		
		var plane = {
			image: images.plane,
			position: { x: 0, y: 0 },
			visible: true
		};
		
		plane.position = rectangle(sprite.getBounds(plane))
			.setCenter(rectangle.getCenter(graphics.getBounds(this.host.graphics.canvas)))
			.getTopLeft();

		this.host.entities.add(water);
		this.host.entities.add(plane);

		var canvas = this.host.graphics.canvas;

		this.host.entities.onUpdate(["update"], function(entity: any) {
            entity.update();
        });

		this.plane = plane;
		this.water = water;
		
		this.waterScrolling = waterScrolling(water);
	},	
	update: function() {
		this.waterScrolling();
		if (this.host.keyboard.isDown(39)) this.plane.position.x += 10;
		if (this.host.keyboard.isDown(37)) this.plane.position.x -= 10;
		if (this.host.keyboard.isDown(40)) this.plane.position.y += 10;
		if (this.host.keyboard.isDown(38)) this.plane.position.y -= 10;
	},	
	draw: function() {
		var canvas = this.host.graphics.canvas;
		renderFill(this.water, canvas);
		sprite.render(this.plane, canvas);
		
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