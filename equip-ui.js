var host2 = new nessy.Host();
host2.plug("gameloop", nessy.GameLoop);
host2.plug("Point", nessy.Point);
host2.plug("Rectangle", nessy.Rectangle);
host2.plug("graphics", nessy.Graphics, { width: 640, height: 480 });
host2.plug("Texture", nessy.Texture);
host2.plug("Sprite", nessy.Sprite);
host2.plug("CompositeSprite", nessy.CompositeSprite);
host2.plug("mouse", nessy.Mouse);
host2.plug("moco", nessy.moco);

var textures = {};

var rect = nessy.chain(nessy.Rectangle);

var Game = function(host) {
	this.host = host;
	this.preload = host.moco.serial([
		host.moco.loadImage("resources/background-default-large.png", function(img) { textures.backgroundLarge = (new host.Texture(img)); }),
		host.moco.loadImage("resources/border-default-large.png", function(img) { textures.borderLarge = (new host.Texture(img)); }),
		host.moco.loadImage("resources/race_human_male-large.jpg", function(img) { textures.humanMaleLarge = (new host.Texture(img)); }),
		host.moco.loadImage("resources/hilite-default-large.png", function(img) { textures.hiliteLarge = (new host.Texture(img)); }),
		host.moco.loadImage("resources/race_human_female-large.jpg", function(img) { textures.humanFemaleLarge = (new host.Texture(img)); }),
	]);
};

Game.prototype = {
	init: function() {
		
		var slots = linq.range(0, 4)
			.map(_ => ({
				texture: textures.backgroundLarge,
				bounds: textures.backgroundLarge.bounds
			}));
		
		this.slots = slots;
		
		this.slots.forEach(slot => {
			slot.bounds = rect(slot.bounds)
				.setTopLeft({ x: 100, y: 100 })
				.value;
		});
		
		this.slots.aggregate(100, (value, slot) => {
			slot.bounds = rect(slot.bounds)
				.setLeft(value)
				.value;
				
			return rect(slot.bounds)
				.getRight()
				.value;
		});
		
		var sprite1 = new this.host.Sprite({
			texture: textures.borderLarge
		});
		
		var sprite2 = new this.host.Sprite({
			texture: textures.humanMaleLarge
		});
		
		var sprite3 = new this.host.Sprite({
			texture: textures.hiliteLarge,
			get visible() {
				return slots[0].item.focus;
			},
			set visible(value) {
				console.log(this, value);
			}
		});
		
		var r = [ sprite1, sprite2, sprite3 ].aggregate(rect(textures.borderLarge.bounds).getCenter().value, (value, sprite) => {
			sprite.position = rect(sprite.bounds)
				.setCenter(value)
				.getTopLeft()
				.value;
				
			return rect(sprite.bounds)
				.getCenter()
				.value;
		});
		
		this.compSprite = new this.host.CompositeSprite({
			sprites: [ sprite2, sprite3, sprite1 ],
			position: { x: 200, y: 200 }
		});
		
		this.slots[0].item = {
			textures: {
				border: textures.borderLarge,
				face: textures.humanMaleLarge,
				hilite: textures.hiliteLarge
			},
			focus: false
		};
		
		this.slots[2].item = {
			textures: {
				border: textures.borderLarge,
				face: textures.humanFemaleLarge,
				hilite: textures.hiliteLarge
			},
			focus: false
		};		
	},
	update: function() {
		var mouseRect = { x: this.host.mouse.x, y: this.host.mouse.y, width: 1, height: 1 };
		
		this.slots.forEach(slot => {
			if (slot.item !== undefined) {
				slot.item.focus = this.host.Rectangle.intersects(slot.bounds, mouseRect);
			}
		});
	},
	draw: function() {
		var graphics = this.host.graphics;
		
		var previousFillStyle = graphics.fillStyle;
		graphics.fillStyle = "#181818";
		graphics.fillRect(graphics.viewport);
		graphics.fillStyle = previousFillStyle;
		
		this.slots.forEach(slot => {
			slot.texture.draw(rect(slot.bounds)
				.getTopLeft()
				.value);
			
			if (slot.item !== undefined) {
				
				var facePos = rect(slot.item.textures.face.bounds)
					.setCenter(rect(slot.bounds)
						.getCenter()
						.value)
					.getTopLeft()
					.value;

				var hilitePos = rect(slot.item.textures.hilite.bounds)
					.setCenter(rect(slot.bounds)
						.getCenter()
						.value)
					.getTopLeft()
					.value;
					
				var borderPos = rect(slot.item.textures.border.bounds)
					.setCenter(rect(slot.bounds)
						.getCenter()
						.value)
					.getTopLeft()
					.value;
				
				slot.item.textures.face.draw(facePos);
				if (slot.item.focus) {
					slot.item.textures.hilite.draw(hilitePos);
				}
				slot.item.textures.border.draw(borderPos);
			}
		});
		
		this.compSprite.draw();
		
		var previousStrokeStyle = graphics.strokeStyle;
		graphics.strokeStyle = "red";
		graphics.strokeRect(this.compSprite.bounds);
		graphics.strokeStyle = previousStrokeStyle;
	}
};

host2.plug("game", Game);

host2.gameloop.run();