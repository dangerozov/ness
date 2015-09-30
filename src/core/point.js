nessy.Point = {
	add: (left, right) => ({ x: left.x + right.x, y: left.y + right.y }),
	sub: (left, right) => ({ x: left.x - right.x, y: left.y - right.y }),
	mul: (left, right) => ({ x: left.x * right.x, y: left.y * right.y }),
	div: (left, right) => ({ x: left.x / right.x, y: left.y / right.y })
};