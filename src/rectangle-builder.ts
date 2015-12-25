import rectangle = require("./rectangle");
import builder = require("./builder");
import object = require("./object");

interface WrappedRectangle {
    value: rectangle.Rectangle;
    
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
	
	getSize: () => rectangle.Size;
	setSize: (size: rectangle.Size) => WrappedRectangle;
	
	getCenter: () => rectangle.Point;
	getTopCenter: () => rectangle.Point;
	getBottomCenter: () => rectangle.Point;
	getTopLeft: () => rectangle.Point;
	getMiddleLeft: () => rectangle.Point;
	getBottomLeft: () => rectangle.Point;
	getTopRight: () => rectangle.Point;
	getMiddleRight: () => rectangle.Point;
	getBottomRight: () => rectangle.Point;
	
	setTopLeft: (point: rectangle.Point) => WrappedRectangle;
	setTopCenter: (point: rectangle.Point) => WrappedRectangle;
	setTopRight: (point: rectangle.Point) => WrappedRectangle;
	setMiddleLeft: (point: rectangle.Point) => WrappedRectangle;
	setCenter: (point: rectangle.Point) => WrappedRectangle;
	setMiddleRight: (point: rectangle.Point) => WrappedRectangle;
	setBottomLeft: (point: rectangle.Point) => WrappedRectangle;
	setBottomCenter: (point: rectangle.Point) => WrappedRectangle;
	setBottomRight: (point: rectangle.Point) => WrappedRectangle;
	
	join: (rect: rectangle.Rectangle) => WrappedRectangle;
	
	intersects: (rect: rectangle.Rectangle) => boolean;
}

let rectangleFunc = builder.build<WrappedRectangle, rectangle.Rectangle>()
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