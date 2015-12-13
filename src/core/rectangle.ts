export interface Point {
	x: number;
	y: number;
}

export interface Size {
	width: number;
	height: number;
}

export interface Rectangle extends Point, Size {
	
}

type RectToPoint = (rect: Rectangle) => Point;

export interface RectangleUtils {
	copy: (rect: Rectangle) => Rectangle;
	
	setX: (rect: Rectangle, value: number) => Rectangle;
	setY: (rect: Rectangle, value: number) => Rectangle;
	setWidth: (rect: Rectangle, value: number) => Rectangle;
	setHeight: (rect: Rectangle, value: number) => Rectangle;
	
	getLeft: (rect: Rectangle) => number;
	getRight: (rect: Rectangle) => number;
	getTop: (rect: Rectangle) => number;
	getBottom: (rect: Rectangle) => number;
	
	setLeft: (rect: Rectangle, value: number) => Rectangle;
	setRight: (rect: Rectangle, value: number) => Rectangle;
	setTop: (rect: Rectangle, value: number) => Rectangle;
	setBottom: (rect: Rectangle, value: number) => Rectangle;
	
	getSize: (rect: Rectangle) => Size;
	setSize: (rect: Rectangle, size: Size) => Rectangle;
	
	getCenter: RectToPoint;
	getTopCenter: RectToPoint;
	getBottomCenter: RectToPoint;
	getTopLeft: RectToPoint;
	getMiddleLeft: RectToPoint;
	getBottomLeft: RectToPoint;
	getTopRight: RectToPoint;
	getMiddleRight: RectToPoint;
	getBottomRight: RectToPoint;


	setTopLeft: RectPointToRect;
	setTopCenter: RectPointToRect;
	setTopRight: RectPointToRect;
	setMiddleLeft: RectPointToRect;
	setCenter: RectPointToRect;
	setMiddleRight: RectPointToRect;
	setBottomLeft: RectPointToRect;
	setBottomCenter: RectPointToRect;
	setBottomRight: RectPointToRect;
	
	join: (leftRect: Rectangle, rightRect: Rectangle) => Rectangle;
	
	intersects: (leftRect: Rectangle, rightRect: Rectangle) => boolean;	
}

export let copy: (rect: Rectangle) => Rectangle = (rect) => ({ x: rect.x, y: rect.y, width: rect.width, height: rect.height });

export let setX: (rect: Rectangle, value: number) => Rectangle = (rect, value) => ({ x: value, y: rect.y, width: rect.width, height: rect.height });
export let setY: (rect: Rectangle, value: number) => Rectangle = (rect, value) => ({ x: rect.x, y: value, width: rect.width, height: rect.height });
export let setWidth: (rect: Rectangle, value: number) => Rectangle = (rect, value) => ({ x: rect.x, y: rect.y, width: value, height: rect.height });
export let setHeight: (rect: Rectangle, value: number) => Rectangle = (rect, value) => ({ x: rect.x, y: rect.y, width: rect.width, height: value });

export let getLeft: (rect: Rectangle) => number = (rect) => rect.x;
export let getRight: (rect: Rectangle) => number = (rect) => rect.x + rect.width;
export let getTop: (rect: Rectangle) => number = (rect) => rect.y;
export let getBottom: (rect: Rectangle) => number = (rect) => rect.y + rect.height;

export let setLeft = setX;
export let setRight: (rect: Rectangle, value: number) => Rectangle = (rect, value) => setX(rect, value - rect.width);
export let setTop = setY;
export let setBottom: (rect: Rectangle, value: number) => Rectangle = (rect, value) => setY(rect, value - rect.height);

export let getSize: (rect: Rectangle) => Size = (rect) => ({ width: rect.width, height: rect.height });
export let setSize: (rect: Rectangle, size: Size) => Rectangle = (rect, size) => ({ x: rect.x, y: rect.y, width: size.width, height: size.height });

let set: (rect: Rectangle, getAnchor: RectToPoint, point: Point) => Rectangle = (rect, getAnchor, point) => {
	let anchorValue = getAnchor(rect);
	let offsetX = point.x - anchorValue.x;
	let offsetY = point.y - anchorValue.y;
	
	return { x: rect.x + offsetX, y: rect.y + offsetY, width: rect.width, height: rect.height };
};

export let getCenter: RectToPoint = (rect) => ({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 });
export let getTopCenter: RectToPoint = (rect) => ({ x: getCenter(rect).x, y: getTop(rect) });
export let getBottomCenter: RectToPoint = (rect) => ({ x: getCenter(rect).x, y: getBottom(rect) });
export let getTopLeft: RectToPoint = (rect) => ({ x: getLeft(rect), y: getTop(rect) });
export let getMiddleLeft: RectToPoint = (rect) => ({ x: getLeft(rect), y: getCenter(rect).y});
export let getBottomLeft: RectToPoint = (rect) => ({ x: getLeft(rect), y: getBottom(rect) });
export let getTopRight: RectToPoint = (rect) => ({ x: getRight(rect), y: getTop(rect) });
export let getMiddleRight: RectToPoint = (rect) => ({ x: getRight(rect), y: getCenter(rect).y });
export let getBottomRight: RectToPoint = (rect) => ({ x: getRight(rect), y: getBottom(rect) });

type RectPointToRect = (rect: Rectangle, point: Point) => Rectangle; 

export let setTopLeft: RectPointToRect = (rect, point) => set(rect, getTopLeft, point);
export let setTopCenter: RectPointToRect = (rect, point) => set(rect, getTopCenter, point);
export let setTopRight: RectPointToRect = (rect, point) => set(rect, getTopRight, point);
export let setMiddleLeft: RectPointToRect = (rect, point) => set(rect, getMiddleLeft, point);
export let setCenter: RectPointToRect = (rect, point) => set(rect, getCenter, point);
export let setMiddleRight: RectPointToRect = (rect, point) => set(rect, getMiddleRight, point);
export let setBottomLeft: RectPointToRect = (rect, point) => set(rect, getBottomLeft, point);
export let setBottomCenter: RectPointToRect = (rect, point) => set(rect, getBottomCenter, point);
export let setBottomRight: RectPointToRect = (rect, point) => set(rect, getBottomRight, point);
	
export let join: (leftRect: Rectangle, rightRect: Rectangle) => Rectangle = (leftRect, rightRect) => {
	let left = Math.min(getLeft(leftRect), getLeft(rightRect));
	let top = Math.min(getTop(leftRect), getTop(rightRect));
	let right = Math.max(getRight(leftRect), getRight(rightRect));
	let bottom = Math.max(getBottom(leftRect), getBottom(rightRect));
	
	return { x: left, y: top, width: right - left, height: bottom - top };
};

export let intersects: (leftRect: Rectangle, rightRect: Rectangle) => boolean = (leftRect, rightRect) => {
	return getTop(rightRect) > getTop(leftRect) &&
		getTop(rightRect) < getBottom(leftRect) &&
		getLeft(rightRect) > getLeft(leftRect) &&
		getLeft(rightRect) < getRight(leftRect);
};