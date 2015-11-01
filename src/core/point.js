nessy.point = (() => {
	var p = {
		add: (left, right) => ({ x: left.x + right.x, y: left.y + right.y }),
		sub: (left, right) => ({ x: left.x - right.x, y: left.y - right.y }),
		mul: (left, right) => ({ x: left.x * right.x, y: left.y * right.y }),
		div: (left, right) => ({ x: left.x / right.x, y: left.y / right.y })
	};

	return p;
})();

nessy.point = ((point) => {

	var validate = func => nessy.func.before(func, (...args) => {
			if (args.some(nessy.obj.isUndefined)) throw "Not Point";
			if (args.some(arg => nessy.obj.values(arg, ["x", "y"]).some(nessy.obj.isUndefined))) 
				throw "Not Point";
		});

	var result = nessy.obj
		.with(point, {
			add: validate,
			sub: validate,
			mul: validate,
			div: validate
		});

	return result;

})(nessy.point);

nessy.point = ((point) => {

	var result = nessy.builder();	
	["add", "sub", "mul", "div"]
		.forEach(name => result.chain(name, point[name]));	
	result = result.value;

	nessy.obj.copy(point, result);

	return result;	

})(nessy.point);