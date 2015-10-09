nessy.point = (() => {
	var p = {
		add: (left, right) => ({ x: left.x + right.x, y: left.y + right.y }),
		sub: (left, right) => ({ x: left.x - right.x, y: left.y - right.y }),
		mul: (left, right) => ({ x: left.x * right.x, y: left.y * right.y }),
		div: (left, right) => ({ x: left.x / right.x, y: left.y / right.y })
	};
	
	return nessy.builder()
		.chain("add", p.add)
		.chain("sub", p.sub)
		.chain("mul", p.mul)
		.chain("div", p.div)
		.value;
})();