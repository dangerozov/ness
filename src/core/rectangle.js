nessy.Rectangle = (() => {
	var r = {};
	
	r.join = (leftRect, rightRect) => {
		var left = Math.min(r.getLeft(leftRect), r.getLeft(rightRect));
		var top = Math.min(r.getTop(leftRect), r.getTop(rightRect));
		var right = Math.max(r.getRight(leftRect), r.getRight(rightRect));
		var bottom = Math.max(r.getBottom(leftRect), r.getBottom(rightRect));
		
		return { x: left, y: top, width: right - left, height: bottom - top };
	};
	
	r.intersects = (leftRect, rightRect) => {
		return r.getTop(rightRect) > r.getTop(leftRect) &&
			r.getTop(rightRect) < r.getBottom(leftRect) &&
			r.getLeft(rightRect) > r.getLeft(leftRect) &&
			r.getLeft(rightRect) < r.getRight(leftRect);
	};
	
	r.copy = (rect) => ({ x: rect.x, y: rect.y, width: rect.width, height: rect.height });
	
	r.setX = (rect, value) => ({ x: value, y: rect.y, width: rect.width, height: rect.height });
	r.setY = (rect, value) => ({ x: rect.x, y: value, width: rect.width, height: rect.height });
	r.setWidth = (rect, value) => ({ x: rect.x, y: rect.y, width: value, height: rect.height });
	r.setHeight = (rect, value) => ({ x: rect.x, y: rect.y, width: rect.width, height: value });

	r.getLeft = (rect) => rect.x;
	r.getRight = (rect) => rect.x + rect.width;
	r.getTop = (rect) => rect.y;
	r.getBottom = (rect) => rect.y + rect.height;
	
	r.setLeft = r.setX;
	r.setRight = (rect, value) => r.setX(rect, value - rect.width);
	r.setTop = r.setY;
	r.setBottom = (rect, value) => r.setY(rect, value - rect.height);
	
	r.getSize = (rect) => ({ x: rect.width, y: rect.height });
	
	r.setSize = (rect, point) => ({ x: rect.x, y: rect.y, width: point.x, height: point.y });
	
	r.set = (rect, anchor, point) => {
		var anchorValue = r[anchor](rect);
		var offsetX = point.x - anchorValue.x;
		var offsetY = point.y - anchorValue.y;
		
		return { x: rect.x + offsetX, y: rect.y + offsetY, width: rect.width, height: rect.height };
	};
	
	r.getTopLeft = (rect) => ({ x: r.getLeft(rect), y: r.getTop(rect) });
	r.getTopCenter = (rect) => ({ x: r.getCenter(rect).x, y: r.getTop(rect) });
	r.getTopRight = (rect) => ({ x: r.getRight(rect), y: r.getTop(rect) });
	r.getMiddleLeft = (rect) => ({ x: r.getLeft(rect), y: r.getCenter(rect).y});
	r.getCenter = (rect) => ({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 });
	r.getMiddleRight = (rect) => ({ x: r.getRight(rect), y: r.getCenter(rect).y });
	r.getBottomLeft = (rect) => ({ x: r.getLeft(rect), y: r.getBottom(rect) });
	r.getBottomCenter = (rect) => ({ x: r.getCenter(rect).x, y: r.getBottom(rect) });
	r.getBottomRight = (rect) => ({ x: r.getRight(rect), y: r.getBottom(rect) });
	
	r.setTopLeft = (rect, point) => r.set(rect, "getTopLeft", point);
	r.setTopCenter = (rect, point) => r.set(rect, "getTopCenter", point);
	r.setTopRight = (rect, point) => r.set(rect, "getTopRight", point);
	r.setMiddleLeft = (rect, point) => r.set(rect, "getMiddleLeft", point);
	r.setCenter = (rect, point) => r.set(rect, "getCenter", point);
	r.setMiddleRight = (rect, point) => r.set(rect, "getMiddleRight", point);
	r.setBottomLeft = (rect, point) => r.set(rect, "getBottomLeft", point);
	r.setBottomCenter = (rect, point) => r.set(rect, "getBottomCenter", point);
	r.setBottomRight = (rect, point) => r.set(rect, "getBottomRight", point);

	return r;
})();