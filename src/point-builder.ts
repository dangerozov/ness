import point = require("./point");
import builder = require("./builder");
import object = require("./object");

type WrappedPoint = {
    value: point.Point;
    add: (point: point.Point) => WrappedPoint;
    sub: (point: point.Point) => WrappedPoint;
    mul: (point: point.Point) => WrappedPoint;
    div: (point: point.Point) => WrappedPoint;
}

let pointFunc = builder.build<WrappedPoint, point.Point>()
    .chain("add", point.add)
    .chain("sub", point.sub)
    .chain("mul", point.mul)
    .chain("div", point.div)
    .value;

let result = object.assign(pointFunc, point);

export = result;