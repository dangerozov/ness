var objToArray = (obj, names) => names.map(name => obj[name]);
var spreadArray = (args, func) => {
	func(...args);
};

var fillRect = (x, y, width, height) => console.log(x, y, width, height);

var obj = (obj) => {
	var wrapped = {
		value: obj,
		pluck: (names) => names.map(name => wrapped.value[name])
	};
	
	return wrapped;
};

var func = (func) => {
	var wrapped = {
		value: func,
		spread: (args) =>
			wrapped.value(...args)
	};
	
	return wrapped;
};

var old = fillRect;
fillRect = (rect) => {
	var args = obj(rect).pluck(["x", "y", "width", "height"]);
	var result = func(old).spread(args);
	return result; 
};