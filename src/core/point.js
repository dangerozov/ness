nessy.point = ((builder, func, obj) => {
	var p = {
		add: (left, right) => ({ x: left.x + right.x, y: left.y + right.y }),
		sub: (left, right) => ({ x: left.x - right.x, y: left.y - right.y }),
		mul: (left, right) => ({ x: left.x * right.x, y: left.y * right.y }),
		div: (left, right) => ({ x: left.x / right.x, y: left.y / right.y })
	};
	
	var result = builder()
		.chain("add", p.add)
		.chain("sub", p.sub)
		.chain("mul", p.mul)
		.chain("div", p.div)
		.value;
		
	result = func(result)
		.before(point => { if (typeof point === "undefined") throw "Not Point"; })
		.before(point => { 
			var invalid = obj(point)
				.values(["x", "y"])
				.some(value => typeof value === "undefined");
				
			if (invalid) throw "Not Point";
		})
		.value;
		
	return result;
		
})(nessy.builder, nessy.func, nessy.obj);