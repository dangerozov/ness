import rectangle = require("./rectangle");
import builder = require("./builder");
import object = require("./object");

type Point = { x: number, y: number };
type Size = { width: number, y: number };
type Rectangle = Point & Size;

type WrappedRectangle = {
    value: Rectangle;
    
	copy: () => WrappedRectangle;
	
	setX: (value: number) => WrappedRectangle;
	setY: (value: number) => WrappedRectangle;
	setWidth: (value: number) => WrappedRectangle;
	setHeight: (value: number) => WrappedRectangle;
	
	getLeft: () => number;
	getRight: () => number;
	getTop: () => number;
	getBottom: () => number;
	
	setLeft: (value: number) => WrappedRectangle;
	setRight: (value: number) => WrappedRectangle;
	setTop: (value: number) => WrappedRectangle;
	setBottom: (value: number) => WrappedRectangle;
	
	getSize: () => Size;
	setSize: (size: Size) => WrappedRectangle;
	
	getCenter: () => Point;
	getTopCenter: () => Point;
	getBottomCenter: () => Point;
	getTopLeft: () => Point;
	getMiddleLeft: () => Point;
	getBottomLeft: () => Point;
	getTopRight: () => Point;
	getMiddleRight: () => Point;
	getBottomRight: () => Point;
	
	setTopLeft: (point: Point) => WrappedRectangle;
	setTopCenter: (point: Point) => WrappedRectangle;
	setTopRight: (point: Point) => WrappedRectangle;
	setMiddleLeft: (point: Point) => WrappedRectangle;
	setCenter: (point: Point) => WrappedRectangle;
	setMiddleRight: (point: Point) => WrappedRectangle;
	setBottomLeft: (point: Point) => WrappedRectangle;
	setBottomCenter: (point: Point) => WrappedRectangle;
	setBottomRight: (point: Point) => WrappedRectangle;
	
	join: (rect: Rectangle) => WrappedRectangle;
	
	intersects: (rect: Rectangle) => boolean;
}

let rectangleFunc = builder.build<WrappedRectangle, Rectangle>()
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

let result = object.assign(rectangleFunc, rectangle);

export = result;