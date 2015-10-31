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
	
	s.new = (obj) => ({
		image: obj.image || null, // nessy.image.default
		position: obj.position || { x: 0, y: 0 }, // nessy.point.default
		visible: obj.visible === undefined ? true : obj.visible // nessy.boolean.default
	});
	
	s.getBounds = (sprite) => ({ x: sprite.position.x, y: sprite.position.y, width: sprite.image.width, height: sprite.image.height });
	
	s.render = (sprite, canvas) => {
		if (sprite.visible) {
			var renderedImage = sprite.image; // nessy.image.render(sprite.image, canvas);
			
			nessy.graphics.drawImage(canvas, renderedImage, { x: sprite.position.x, y: sprite.position.y, width: renderedImage.width, height: renderedImage.height });
		}
	};
	
	return s;
})();

nessy.compositeSprite = (() => {
	var cs = {};
	
	cs.getBounds = (compositeSprite) => {
		var bounds = compositeSprite.sprites
			.map(nessy.sprite.getBounds)
			.aggregate(nessy.rectangle.join);
			
		bounds = nessy.rectangle.setTopLeft(bounds, compositeSprite.position);
		return bounds;	
	};
	
	cs.render = (compositeSprite, canvas) => {
		if (compositeSprite.visible) {
			compositeSprite.sprites.forEach(sprite => {
				var oldPosition = sprite.position;
				sprite.position = nessy.point.add(sprite.position, compositeSprite.position);
				nessy.sprite.render(sprite, canvas);
				sprite.position = oldPosition;
			});
		}
	};
	
	return cs;
})();