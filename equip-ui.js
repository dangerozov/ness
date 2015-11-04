var host2 = new nessy.Host();
host2.plug("gameloop", nessy.GameLoop);
host2.plug("graphics", nessy.Graphics, { width: window.innerWidth, height: window.innerHeight });
host2.plug("mouse", nessy.Mouse);
host2.plug("moco", nessy.moco);

var images = {};

var rect = nessy.rectangle;

var Game = function(host) {
	this.host = host;
	this.preload = host.moco.serial([
		host.moco.loadImage("resources/background-default-large.png", function(img) { images.backgroundLarge = img; }),
		host.moco.loadImage("resources/border-default-large.png", function(img) { images.borderLarge = img; }),
		host.moco.loadImage("resources/race_human_male-large.jpg", function(img) { images.humanMaleLarge = img; }),
		host.moco.loadImage("resources/hilite-default-large.png", function(img) { images.hiliteLarge = img; }),
		host.moco.loadImage("resources/race_human_female-large.jpg", function(img) { images.humanFemaleLarge = img; }),
	]);
};

Game.prototype = {
	init: function() {
		
		this.slots = linq.range(0, 4)
			.map(_ => ({
				image: images.backgroundLarge,
				position: { x: 100, y: 100 },
				visible: true
			}));
		
		this.slots.aggregate(100, (value, slot) => {
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
		
		var putToCenter = (items, center) => {
			items.aggregate(rect(nessy.image.getBounds(images.borderLarge)).getCenter(), (value, sprite) => {
				sprite.position = rect(nessy.sprite.getBounds(sprite))
					.setCenter(value)
					.getTopLeft();
					
				return rect(nessy.sprite.getBounds(sprite))
					.getCenter();
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
		female = {
			items: female,
			position: { x: 0, y: 0 },
			visible: true	
		};
		
		this.slots[0].item = this.male;
		this.slots[2].item = female;
	},
	update: function() {
		var mouseRect = { x: this.host.mouse.x, y: this.host.mouse.y, width: 1, height: 1 };
		
		// this.slots.forEach(slot => {
		// 	if (slot.item !== undefined) {
		// 		slot.item.images.hilite.visible = nessy.rectangle.intersects(nessy.sprite.getBounds(slot), mouseRect); 
		// 	}
		// });
	},
	draw: function() {
		var canvas = this.host.graphics.__canvas;
		
		nessy.graphics.sandbox(canvas, canvas => {
			canvas.getContext("2d").fillStyle = "#181818";
			nessy.graphics.fillRect(canvas, nessy.graphics.getBounds(canvas));
		});
		
		this.slots.forEach(slot => {
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
		
		nessy.graphics.sandbox(this.host.graphics.__canvas, canvas => {
			canvas.getContext("2d").strokeStyle = "red";
			nessy.graphics.strokeRect(canvas, nessy.compositeSprite.getBounds(this.male, nessy.sprite.getBounds));
		});
		this.male.position = prevPos;


		var toCenter = (left, right) => {
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
		
		var toSprite = (item) => {
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
				.aggregate(bounds, (leftBounds, right) => {
					var rightBounds = nessy.sprite.getBounds(right);
					var center = toCenter(leftBounds, rightBounds);
					right.position = nessy.rectangle(center)
						.getTopLeft();
					
					return leftBounds;
				});
				
			return sprites;
		};
		
		var renderInventoryItem = (inventoryItem) => {			
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
		
		var renderContainer = (cont, renderItem) => {
			container.items.forEach((item) => {
				renderItem(item, cont);
			});
			
			// return container.items
			//		.map(item => renderItem(item, container))
			//		.aggregate(EmptyCanvas, nessy.canvas.join)
		};
		
		var getBounds = (container, getBounds, aggregate) => {
			return container.items
				.map(item => getBounds(item, container))
				.aggregate({ x: 0, y: 0, width: 0, height: 0 }, nessy.rectangle.join);
		};
		
		var bnds = getBounds(container, (item, cont) => {
				var prevPos = item.position;
				item.position = nessy.point.add(item.position, cont.position);
			var bounds = nessy.sprite.getBounds(item);
				item.position = prevPos;
			return bounds;
		});
		
		renderContainer(
			container,
			(item, cont) => {
					var prevPos = item.position;
					item.position = nessy.point.add(item.position, cont.position);
				nessy.sprite.render(item, canvas);
					item.position = prevPos;
					// return rendered image
			});
		
		
		
	}
};

host2.plug("game", Game);

host2.gameloop.run();