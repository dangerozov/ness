var host2 = new nessy.Host();
host2.plug("gameloop", nessy.GameLoop);
host2.plug("graphics", nessy.Graphics, { width: 640, height: 480 });
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
		
		var borderSprite = {
			image: images.borderLarge,
			position: { x: 0, y: 0 },
			visible: true
		};
		
		var maleSprite = nessy.sprite.new({
			image: images.humanMaleLarge
		});
		
		var femaleSprite = nessy.sprite.new({
			image: images.humanFemaleLarge
		});
		
		var hiliteSprite = nessy.sprite.new({
			image: images.hiliteLarge,
			// visible: slots[0].item.focus
		});
		
		var r = [ borderSprite, maleSprite, hiliteSprite ].aggregate(rect(nessy.image.getBounds(images.borderLarge)).getCenter(), (value, sprite) => {
			sprite.position = rect(nessy.sprite.getBounds(sprite))
				.setCenter(value)
				.getTopLeft();
				
			return rect(nessy.sprite.getBounds(sprite))
				.getCenter();
		});
		
		this.compSprite = {
			sprites: [ maleSprite, hiliteSprite, borderSprite ],
			position: { x: 200, y: 200 },
			visible: true
		};
		
		var maleItem = {
			sprites: [ maleSprite, hiliteSprite, borderSprite ],
			position: { x: 0, y: 0 },
			visible: true
		};
		
		this.slots[0].item = {
			images: {
				border: images.borderLarge,
				face: images.humanMaleLarge,
				hilite: images.hiliteLarge
			},
			focus: false
		};
		
		this.slots[2].item = {
			images: {
				border: images.borderLarge,
				face: images.humanFemaleLarge,
				hilite: images.hiliteLarge
			},
			focus: false
		};
	},
	update: function() {
		var mouseRect = { x: this.host.mouse.x, y: this.host.mouse.y, width: 1, height: 1 };
		
		this.slots.forEach(slot => {
			if (slot.item !== undefined) {
				slot.item.images.hilite.visible = nessy.rectangle.intersects(nessy.sprite.getBounds(slot), mouseRect); 
			}
		});
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
				
				var facePos = nessy.rectangle(nessy.image.getBounds(slot.item.images.face))
					.setCenter(nessy.rectangle.getCenter(slotBounds))
					.getTopLeft();

				var hilitePos = nessy.rectangle(nessy.image.getBounds(slot.item.images.hilite))
					.setCenter(nessy.rectangle.getCenter(slotBounds))
					.getTopLeft();
					
				var borderPos = nessy.rectangle(nessy.image.getBounds(slot.item.images.border))
					.setCenter(nessy.rectangle.getCenter(slotBounds))
					.getTopLeft();
				
				slot.item.images.face.image = slot.item.images.face;
				slot.item.images.face.position = facePos;
				slot.item.images.face.visible = true;
				
				slot.item.images.hilite.image = slot.item.images.hilite;
				slot.item.images.hilite.position = hilitePos;
				slot.item.images.hilite.visible = true;
				
				slot.item.images.border.image = slot.item.images.border;
				slot.item.images.border.position = borderPos;
				slot.item.images.border.visible = true;
				
				nessy.sprite.render(slot.item.images.face, canvas);
				nessy.sprite.render(slot.item.images.hilite, canvas);
				nessy.sprite.render(slot.item.images.border, canvas);
			}
		});
		
		nessy.compositeSprite.render(this.compSprite, canvas);
		
		nessy.graphics.sandbox(this.host.graphics.__canvas, canvas => {
			canvas.getContext("2d").strokeStyle = "red";
			nessy.graphics.strokeRect(canvas, nessy.compositeSprite.getBounds(this.compSprite));
		});
	}
};

host2.plug("game", Game);

host2.gameloop.run();