import rectangle = require("./rectangle");
import builder = require("./builder");
import object = require("./object");

export interface Rectangle {
	copy: () => rectangle.Rectangle;
	
	setX: (value: number) => rectangle.Rectangle;
	setY: (value: number) => rectangle.Rectangle;
	setWidth: (value: number) => rectangle.Rectangle;
	setHeight: (value: number) => rectangle.Rectangle;
	
	getLeft: () => number;
	getRight: () => number;
	getTop: () => number;
	getBottom: () => number;
	
	setLeft: (value: number) => rectangle.Rectangle;
	setRight: (value: number) => rectangle.Rectangle;
	setTop: (value: number) => rectangle.Rectangle;
	setBottom: (value: number) => rectangle.Rectangle;
	
	getSize: () => rectangle.Size;
	setSize: (size: rectangle.Size) => rectangle.Rectangle;
	
	getCenter: () => rectangle.Point;
	getTopCenter: () => rectangle.Point;
	getBottomCenter: () => rectangle.Point;
	getTopLeft: () => rectangle.Point;
	getMiddleLeft: () => rectangle.Point;
	getBottomLeft: () => rectangle.Point;
	getTopRight: () => rectangle.Point;
	getMiddleRight: () => rectangle.Point;
	getBottomRight: () => rectangle.Point;
	
	setTopLeft: (point: rectangle.Point) => rectangle.Rectangle;
	setTopCenter: (point: rectangle.Point) => rectangle.Rectangle;
	setTopRight: (point: rectangle.Point) => rectangle.Rectangle;
	setMiddleLeft: (point: rectangle.Point) => rectangle.Rectangle;
	setCenter: (point: rectangle.Point) => rectangle.Rectangle;
	setMiddleRight: (point: rectangle.Point) => rectangle.Rectangle;
	setBottomLeft: (point: rectangle.Point) => rectangle.Rectangle;
	setBottomCenter: (point: rectangle.Point) => rectangle.Rectangle;
	setBottomRight: (point: rectangle.Point) => rectangle.Rectangle;
	
	join: (rect: rectangle.Rectangle) => rectangle.Rectangle;
	
	intersects: (rect: rectangle.Rectangle) => boolean;
}

let result = builder.build<Rectangle, rectangle.Rectangle>()
	.chain("copy", rectangle.copy)
	
	.chain("setX", rectangle.setX)
	.chain("setY", rectangle.setY)
	.chain("setWidth", rectangle.setWidth)
	.chain("setHeight", rectangle.setHeight)
	
	.unbox("getLeft", rectangle.getLeft)
	.unbox("getRight", rectangle.getRight)
	.unbox("getTop", rectangle.getTop)
	.unbox("getBottom", rectangle.getBottom)
	
	.chain("setLeft", rectangle.setLeft)
	.chain("setRight", rectangle.setRight)
	.chain("setTop", rectangle.setTop)
	.chain("setBottom", rectangle.setBottom)
	
	.unbox("getSize", rectangle.getSize)
	.chain("setSize", rectangle.setSize)
	
	.unbox("getCenter", rectangle.getCenter)
	.unbox("getTopCenter", rectangle.getTopCenter)
	.unbox("getBottomCenter", rectangle.getBottomCenter)
	.unbox("getTopLeft", rectangle.getTopLeft)
	.unbox("getMiddleLeft", rectangle.getMiddleLeft)
	.unbox("getBottomLeft", rectangle.getBottomLeft)
	.unbox("getTopRight", rectangle.getTopRight)
	.unbox("getMiddleRight", rectangle.getMiddleRight)
	.unbox("getBottomRight", rectangle.getBottomRight)
	
	.chain("setTopLeft", rectangle.setTopLeft)
	.chain("setTopCenter", rectangle.setTopCenter)
	.chain("setTopRight", rectangle.setTopRight)
	.chain("setMiddleLeft", rectangle.setMiddleLeft)
	.chain("setCenter", rectangle.setCenter)
	.chain("setMiddleRight", rectangle.setMiddleRight)
	.chain("setBottomLeft", rectangle.setBottomLeft)
	.chain("setBottomCenter", rectangle.setBottomCenter)
	.chain("setBottomRight", rectangle.setBottomRight)
	
	.chain("join", rectangle.join)
	
	.unbox("intersects", rectangle.intersects)
	
	.value;

interface RectangleUtils {
	(context: rectangle.Rectangle): Rectangle;
	
}

result = object.copy(rectangle, result);