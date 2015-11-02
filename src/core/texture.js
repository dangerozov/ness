nessy.image = (() => {
	var i = {};
	
	i.getBounds = (image) => ({ x: 0, y: 0, width: image.width, height: image.height });
	
	i.render = (image, canvas) => {
		nessy.graphics.drawImage(canvas, image, i.getBounds(image));
	};
	
	return i;
})();

nessy.sprite = (() => {
	var s = {};
	
	s.mixin = (obj) => {
		obj.image = obj.image || null;
		obj.position = obj.position || { x: 0, y: 0 };
		obj.visible = obj.hidden || false;
		return obj;
	};
	
	s.getBounds = (sprite) => ({ x: sprite.position.x, y: sprite.position.y, width: sprite.image.width, height: sprite.image.height });
	
	s.render = (sprite, canvas) => {
		if (sprite.visible) {
			var renderedImage = sprite.image; // nessy.image.render(sprite.image, canvas);
			
			nessy.graphics.drawImage(canvas, renderedImage, sprite.position.x, sprite.position.y);
		}
	};
	
	return s;
})();

nessy.compositeSprite = (() => {
	var cs = {};
	
	cs.getBounds = (compositeSprite, getItemBounds) => {
		var bounds = compositeSprite.items
			.map(getItemBounds)
			.aggregate(nessy.rectangle.join);

		bounds = nessy.rectangle.setTopLeft(bounds, compositeSprite.position);
		return bounds;
	};
	
	cs.render = (compositeSprite, canvas, renderItem) => {
		if (compositeSprite.visible) {
			compositeSprite.items.forEach(sprite => {
				var oldPosition = sprite.position;
				sprite.position = nessy.point.add(sprite.position, compositeSprite.position);
				renderItem(sprite, canvas);
				sprite.position = oldPosition;
			});
		}
	};
	
	return cs;
})();