import graphics = require("./src/graphics");
import rectangle = require("./src/rectangle-builder");
import sprite = require("./src/sprite");
import mouse = require("./src/mouse");
import entities = require("./src/entities");
import keyboard = require("./src/keyboard");

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

var renderFill = (sprite: any, canvas: HTMLCanvasElement & { context: CanvasRenderingContext2D }) => {
	var bounds = graphics.getBounds(canvas);
	bounds.height += sprite.image.height;
	var wtr = graphics.create(bounds);
	var pattern = graphics.createPattern(wtr.context, sprite.image, "repeat");
	
	graphics.sandbox(wtr.context, ctx => {
		ctx.fillStyle = pattern;
		graphics.fillRect(ctx, graphics.getBounds(wtr));
	});
	
	graphics.drawImage(canvas.context, wtr, sprite.position.x, sprite.position.y);
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
    moco: any
};

var host2 = new nessy.Host();
host2.plug("gameloop", nessy.GameLoop);
host2.plug("timer", nessy.Timer);
host2.plug("graphics", graphics.init(host2, { width: window.innerWidth, height: window.innerHeight }));
host2.plug("renderer", nessy.Renderer);
host2.plug("keyboard", keyboard.init(host2));
host2.plug("mouse", mouse.init(host2));
host2.plug("entities", entities.init());
host2.plug("moco", nessy.moco);

host2.debug = true;

type Host = {
    moco: any;
    entities: any;
    graphics: { canvas: HTMLCanvasElement & { context: CanvasRenderingContext2D } };
    keyboard: any;
    mouse: any;
}

let Game = function(host: Host) {
    
    let self: {
        host: Host;
        preload: any;
        plane: {
            image: HTMLImageElement;
            position: { x: number, y: number };
            visible: boolean;            
        };
        water: {
            image: HTMLImageElement,
            position: { x: number, y: number };
            visible: boolean;
            fill: boolean;
            host: Host;
        };
        waterScrolling: any;
        init: () => void;
        update: () => void;
        draw: () => void;
    } = {
        host: host,
        preload: host.moco.serial([
            host.moco.loadImage("resources/plane.png", (img: HTMLImageElement) => images.plane = img),
            host.moco.loadImage("resources/water.png", (img: HTMLImageElement) => images.water = img)
        ]),
        plane: null,
        water: null,
        waterScrolling: null,
        init: () => {
            var water = {
                image: images.water,
                position: { x: 0, y: 0 },
                visible: true,
                fill: true,
                host: host
            };
            
            var plane = {
                image: images.plane,
                position: { x: 0, y: 0 },
                visible: true
            };
            
            plane.position = rectangle(sprite.getBounds(plane))
                .setCenter(rectangle.getCenter(graphics.getBounds(self.host.graphics.canvas)))
                .getTopLeft();

            self.host.entities.add(water);
            self.host.entities.add(plane);

            var canvas = self.host.graphics.canvas;

            self.host.entities.onUpdate(["update"], function(entity: any) {
                entity.update();
            });

            self.plane = plane;
            self.water = water;
            
            self.waterScrolling = waterScrolling(water);
        },
        update: () => {
            self.waterScrolling();
            if (self.host.keyboard.isDown(39)) self.plane.position.x += 10;
            if (self.host.keyboard.isDown(37)) self.plane.position.x -= 10;
            if (self.host.keyboard.isDown(40)) self.plane.position.y += 10;
            if (self.host.keyboard.isDown(38)) self.plane.position.y -= 10;
        },
        draw: () => {
            let canvas = self.host.graphics.canvas;
            renderFill(self.water, canvas);
            sprite.render(self.plane, canvas.context);
            
            if (self.host.keyboard.isDown(13)) {
                canvas.context.font = "bold 12pt Consolas";
                canvas.context.fillStyle = "white";
                graphics.fillText(canvas.context, "pEnter pressed", 200, 200);
            }
            if (self.host.mouse.isDown) {
                canvas.context.font = "bold 12pt Consolas";
                canvas.context.fillStyle = "white";
                graphics.fillText(canvas.context, "pMouse pressed", self.host.mouse.x + 2, self.host.mouse.y + 2);
            }
        }
    }
    
    
    
    return self;
};

host2.plug("game", Game(host2));

host2.gameloop.run();