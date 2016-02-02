type Point = { x: number, y: number };
type PointsToPoint = (left: Point, right: Point) => Point;

export let add: PointsToPoint = (left, right) => ({ 
    x: left.x + right.x,
    y: left.y + right.y
});

export let sub: PointsToPoint = (left, right) => ({
    x: left.x - right.x,
    y: left.y - right.y
});

export let mul: PointsToPoint = (left, right) => ({
    x: left.x * right.x,
    y: left.y * right.y
});

export let div: PointsToPoint = (left, right) => ({
    x: left.x / right.x,
    y: left.y / right.y
});