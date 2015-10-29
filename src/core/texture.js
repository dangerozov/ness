nessy.Texture = function(host) {
	var Texture = function(texture, bounds) {
		if (!(texture instanceof Image)) throw "Not Image";
		
		this.raw = texture;
		this.bounds = bounds || { x: 0, y: 0, width: texture.width, height: texture.height };
	};
	
	Texture.prototype = {
		draw: function(point, scale) {
			point = point || { x: 0, y: 0 };
			scale = scale || { x: 1, y: 1 };
	
			nessy.graphics.drawImage(host.graphics.__canvas, this.raw, point.x, point.y);
		}
	};
	
	return Texture;
};

nessy.Sprite = function(host) {
	var Sprite = function(args) {
		if (!(args.texture instanceof host.Texture)) throw "Not Texture";
		
		this.texture = args.texture;
		this.position = args.position || { x: 0, y: 0 };
		this.scale = args.scale || { x: 1, y: 1 };
		if (args.hasOwnProperty("visible")) {
			Object.defineProperty(this, "visible", {
				get: function() { return args.visible; }
			});
		}
		else {
			this.visible = true;
		}
	};
	
	Sprite.prototype = {
		draw: function(args) {
			if (args.visible && this.visible) {
				var absolutePosition = nessy.point(args.position).add(this.position).value;
				
				nessy.graphics.drawImage(host.graphics.__canvas, this.texture.raw, absolutePosition.x, absolutePosition.y);
			}
		},
		get bounds() {
			return { x: this.position.x, y: this.position.y, width: this.texture.bounds.width, height: this.texture.bounds.height };
		}
	};
	
	return Sprite;
};

nessy.CompositeSprite = function(host) {
	var CompositeSprite = function(args) {
		this.sprites = args.sprites;
		this.position = args.position || { x: 0, y: 0 };
		this.scale = args.scale || { x: 1, y: 1 };
		this.visible = args.visible || true;
	};
	
	CompositeSprite.prototype = {
		draw: function() {
			if (this.visible) {
				this.sprites.forEach(function(sprite) {
					sprite.draw(this);
				}.bind(this));
			}
		},
		get bounds() {
			var bounds = this.sprites
				.map(function(sprite) { return sprite.bounds; })
				.aggregate(nessy.rectangle.join);

			bounds = nessy.rectangle(bounds).setTopLeft(this.position).value;
			return bounds;
		}
	};
	
	return CompositeSprite;
};