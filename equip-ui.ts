import array = require("./src/array");
import point = require("./src/point");
import rectangle = require("./src/rectangle-builder");
import sprite = require("./src/sprite");
import compositeSprite = require("./src/compositeSprite");
import graphics = require("./src/graphics");
import mouse = require("./src/mouse");

declare let nessy: {
    Host: any,
    GameLoop: any,
    moco: any
};

var host2 = new nessy.Host();
host2.plug("gameloop", nessy.GameLoop);
host2.plug("graphics", graphics.init(host2, { width: window.innerWidth, height: window.innerHeight }));
host2.plug("mouse", mouse.init(host2));
host2.plug("moco", nessy.moco);

var images: {
    backgroundLarge: any;
    borderLarge: any;
    humanMaleLarge: any;
    hiliteLarge: any;
    humanFemaleLarge: any;
    cursor: any
} = {
    backgroundLarge: null,
    borderLarge: null,
    humanMaleLarge: null,
    hiliteLarge: null,
    humanFemaleLarge: null,
    cursor: null
};

var Game = function(host: any) {
	this.host = host;
	this.preload = host.moco.serial([
		host.moco.loadImage("resources/background-default-large.png", (img: any) => { images.backgroundLarge = img; }),
		host.moco.loadImage("resources/border-default-large.png", (img: any) => { images.borderLarge = img; }),
		host.moco.loadImage("resources/race_human_male-large.jpg", (img: any) => { images.humanMaleLarge = img; }),
		host.moco.loadImage("resources/hilite-default-large.png", (img: any) => { images.hiliteLarge = img; }),
		host.moco.loadImage("resources/race_human_female-large.jpg", (img: any) => { images.humanFemaleLarge = img; }),
		host.moco.loadImage("resources/cursor-small.png", (img: any) => images.cursor = img)
	]);
};

Game.prototype = {
	init: function() {
		
		this.cursor = {
			image: images.cursor,
			position: { x: 200, y: 50 },
			visible: true
		};
		
		this.slots = array.range(0, 4)
			.map((_: any) => ({
				image: images.backgroundLarge,
				position: { x: 100, y: 100 },
				visible: true
			}));
		
		array.aggregate(
            this.slots,
            (value: any, slot: any) => {
                slot.position = rectangle(sprite.getBounds(slot))
                    .setLeft(value)
                    .getTopLeft();
                        
                return rectangle(sprite.getBounds(slot))
                    .getRight();
            },
            100);
		
		var borderSprite = {
			image: images.borderLarge,
            position: { x: 0, y: 0 },
            visible: true
		};
		
		var maleSprite = {
			image: images.humanMaleLarge,
            position: { x: 0, y: 0 },
            visible: true
		};
		
		var femaleSprite = {
			image: images.humanFemaleLarge,
            position: { x: 0, y: 0 },
            visible: true
		};
		
		var hiliteSprite = {
			image: images.hiliteLarge,
            position: { x: 0, y: 0 },
            visible: true //slots[0].item.focus
		};
		
		var putToCenter = (items: any) => {
			
			var joined = array.aggregate(
                items.map((item: any) => sprite.getBounds(item)),
                rectangle.join);
				
			var center = rectangle.getCenter(joined);		
			
			items.forEach((item: any) => {
				item.position = rectangle(sprite.getBounds(item))
					.setCenter(center)
					.getTopLeft();
			});
		};
		
		var male = [images.humanMaleLarge, images.hiliteLarge, images.borderLarge]
			.map(image => ({
				image: image,
				position: { x: 0, y: 0 },
				visible: true
			}));
		putToCenter(male);
		this.male = {
			items: male,
			position: { x: 0, y: 0 },
			visible: true
		};
		
		var female = [images.humanFemaleLarge, images.hiliteLarge, images.borderLarge]
			.map(image => ({
				image: image,
				position: { x: 0, y: 0 },
				visible: true
			}));
		putToCenter(female);
		this.female = {
			items: female,
			position: { x: 0, y: 0 },
			visible: true	
		};
		
		this.slots[0].item = this.male;
		this.slots[2].item = this.female;
	},
	update: function() {
		var mouseRect = { x: this.host.mouse.x, y: this.host.mouse.y, width: 1, height: 1 };
		
		// this.slots.forEach(slot => {
		// 	if (slot.item !== undefined) {
		// 		slot.item.images.hilite.visible = nessy.rectangle.intersects(nessy.sprite.getBounds(slot), mouseRect); 
		// 	}
		// });
		
		this.cursor.position.x = Math.floor(this.host.mouse.x / 24) * 24;
		this.cursor.position.y = Math.floor(this.host.mouse.y / 24) * 24;
	},
	draw: function() {
		var canvas = this.host.graphics.canvas;
		
		graphics.sandbox(canvas, (canvas: any) => {
			canvas.getContext("2d").fillStyle = "#181818";
			graphics.fillRect(canvas, graphics.getBounds(canvas));
		});
		
		this.slots.forEach((slot: any) => {
			sprite.render(slot, canvas);
			
			if (slot.item !== undefined) {
				var slotBounds = sprite.getBounds(slot);
				
				var prevPos = slot.item.position;
				
				slot.item.position = rectangle(compositeSprite.getBounds(slot.item, sprite.getBounds))
					.setCenter(rectangle.getCenter(slotBounds))
					.getTopLeft();
				compositeSprite.render(slot.item, canvas, sprite.render);
				
				slot.item.position = prevPos;
			}
		});
		
		var prevPos = this.male.position;
		this.male.position = { x: 200, y: 200 };
		compositeSprite.render(this.male, canvas, sprite.render);
		
		graphics.sandbox(this.host.graphics.canvas, (canvas: any) => {
			canvas.getContext("2d").strokeStyle = "red";
			graphics.strokeRect(canvas, compositeSprite.getBounds(this.male, sprite.getBounds));
		});
		this.male.position = prevPos;


		var toCenter = (left: any, right: any) => {
			var center = rectangle(left)
				.getCenter();
			
			var position = rectangle(right)
				.setCenter(center)
				.getTopLeft();

			return { x: position.x, y: position.y, width: right.width, height: right.height };
		};
		
		var inventoryItem = {
			image: images.humanMaleLarge
		};
		
		var toSprite = (item: any) => {
			var image = item.image;
			var hilite = images.hiliteLarge;
			var border = images.borderLarge;
			
			var sprites = [image, hilite, border]
				.map(image => ({
					image: image,
					position: { x: 0, y: 0 },
					visible: true
				}));
			
			var bounds = array.aggregate(
                sprites.map(sprite.getBounds),
                rectangle.join);
				
			array.aggregate(
                sprites,
                (leftBounds: any, right: any) => {
                    var rightBounds = sprite.getBounds(right);
                    var center = toCenter(leftBounds, rightBounds);
                    right.position = rectangle(center)
                        .getTopLeft();
                    
                    return leftBounds;
                },
                bounds);
				
			return sprites;
		};
		
		var renderInventoryItem = (inventoryItem: any) => {			
			var cnv = graphics.create({ width: 68, height: 68 });
			
			var sprites = toSprite(inventoryItem);
			sprites.forEach(item => sprite.render(item, cnv.context));
			
			return cnv;
		};
		
		var cnv = renderInventoryItem(inventoryItem);			
		
		graphics.drawImage(canvas, cnv, 0, 0);
		
		
		var container = {
			items: this.male.items,
			position: { x: 300, y: 300 }
		};
		
		var renderContainer = (cont: any, renderItem: any) => {
			container.items.forEach((item: any) => {
				renderItem(item, cont);
			});
			
			// return container.items
			//		.map(item => renderItem(item, container))
			//		.aggregate(EmptyCanvas, nessy.canvas.join)
		};
		
		var getBounds = (container: any, getBounds: any) => {
			return array.aggregate(
                container.items.map((item: any) => getBounds(item, container)),
				rectangle.join,
                { x: 0, y: 0, width: 0, height: 0 });
		};
		
		var bnds = getBounds(container, (item: any, cont: any) => {
				var prevPos = item.position;
				item.position = point.add(item.position, cont.position);
			var bounds = sprite.getBounds(item);
				item.position = prevPos;
			return bounds;
		});
		
		renderContainer(
			container,
			(item: any, cont: any) => {
					var prevPos = item.position;
					item.position = point.add(item.position, cont.position);
				sprite.render(item, canvas);
					item.position = prevPos;
					// return rendered image
			});
		
		sprite.render(this.cursor, canvas);
		
	}
};

host2.plug("game", Game);

host2.gameloop.run();