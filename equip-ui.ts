declare let nessy: {
    Host: any,
    GameLoop: any,
    Graphics: any,
    Mouse: any,
    moco: any,
    rectangle: any,
    sprite: any,
    compositeSprite: any,
    graphics: any,
    point: any
};

declare let linq: any;

interface Array<T> {
    aggregate: any
}

var host2 = new nessy.Host();
host2.plug("gameloop", nessy.GameLoop);
host2.plug("graphics", nessy.Graphics, { width: window.innerWidth, height: window.innerHeight });
host2.plug("mouse", nessy.Mouse);
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

var rect = nessy.rectangle;

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
		
		this.slots = linq.range(0, 4)
			.map((_: any) => ({
				image: images.backgroundLarge,
				position: { x: 100, y: 100 },
				visible: true
			}));
		
		this.slots.aggregate(100, (value: any, slot: any) => {
			slot.position = rect(nessy.sprite.getBounds(slot))
				.setLeft(value)
				.getTopLeft();
				
			return rect(nessy.sprite.getBounds(slot))
				.getRight();
		});
		
		var borderSprite = nessy.sprite.mixin({
			image: images.borderLarge
		});
		
		var maleSprite = nessy.sprite.mixin({
			image: images.humanMaleLarge
		});
		
		var femaleSprite = nessy.sprite.mixin({
			image: images.humanFemaleLarge
		});
		
		var hiliteSprite = nessy.sprite.mixin({
			image: images.hiliteLarge
			// visible: slots[0].item.focus
		});
		
		var putToCenter = (items: any) => {
			
			var joined = items
				.map((item: any) => nessy.sprite.getBounds(item))
				.aggregate(nessy.rectangle.join);
				
			var center = nessy.rectangle.getCenter(joined);		
			
			items.forEach((item: any) => {
				item.position = rect(nessy.sprite.getBounds(item))
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
		var canvas = this.host.graphics.__canvas;
		
		nessy.graphics.sandbox(canvas, (canvas: any) => {
			canvas.getContext("2d").fillStyle = "#181818";
			nessy.graphics.fillRect(canvas, nessy.graphics.getBounds(canvas));
		});
		
		this.slots.forEach((slot: any) => {
			nessy.sprite.render(slot, canvas);
			
			if (slot.item !== undefined) {
				var slotBounds = nessy.sprite.getBounds(slot);
				
				var prevPos = slot.item.position;
				
				slot.item.position = nessy.rectangle(nessy.compositeSprite.getBounds(slot.item, nessy.sprite.getBounds))
					.setCenter(nessy.rectangle.getCenter(slotBounds))
					.getTopLeft();
				nessy.compositeSprite.render(slot.item, canvas, nessy.sprite.render);
				
				slot.item.position = prevPos;
			}
		});
		
		var prevPos = this.male.position;
		this.male.position = { x: 200, y: 200 };
		nessy.compositeSprite.render(this.male, canvas, nessy.sprite.render);
		
		nessy.graphics.sandbox(this.host.graphics.__canvas, (canvas: any) => {
			canvas.getContext("2d").strokeStyle = "red";
			nessy.graphics.strokeRect(canvas, nessy.compositeSprite.getBounds(this.male, nessy.sprite.getBounds));
		});
		this.male.position = prevPos;


		var toCenter = (left: any, right: any) => {
			var center = nessy.rectangle(left)
				.getCenter();
			
			var position = nessy.rectangle(right)
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
			
			var bounds = sprites
				.map(nessy.sprite.getBounds)
				.aggregate(nessy.rectangle.join);
				
			sprites
				.aggregate(bounds, (leftBounds: any, right: any) => {
					var rightBounds = nessy.sprite.getBounds(right);
					var center = toCenter(leftBounds, rightBounds);
					right.position = nessy.rectangle(center)
						.getTopLeft();
					
					return leftBounds;
				});
				
			return sprites;
		};
		
		var renderInventoryItem = (inventoryItem: any) => {			
			var cnv = nessy.graphics.create({ width: 68, height: 68 });
			
			var sprites = toSprite(inventoryItem);
			sprites.forEach(sprite => nessy.sprite.render(sprite, cnv));
			
			return cnv;
		};
		
		var cnv = renderInventoryItem(inventoryItem);			
		
		nessy.graphics.drawImage(canvas, cnv, 0, 0);
		
		
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
			return container.items
				.map((item: any) => getBounds(item, container))
				.aggregate({ x: 0, y: 0, width: 0, height: 0 }, nessy.rectangle.join);
		};
		
		var bnds = getBounds(container, (item: any, cont: any) => {
				var prevPos = item.position;
				item.position = nessy.point.add(item.position, cont.position);
			var bounds = nessy.sprite.getBounds(item);
				item.position = prevPos;
			return bounds;
		});
		
		renderContainer(
			container,
			(item: any, cont: any) => {
					var prevPos = item.position;
					item.position = nessy.point.add(item.position, cont.position);
				nessy.sprite.render(item, canvas);
					item.position = prevPos;
					// return rendered image
			});
		
		nessy.sprite.render(this.cursor, canvas);
		
	}
};

host2.plug("game", Game);

host2.gameloop.run();