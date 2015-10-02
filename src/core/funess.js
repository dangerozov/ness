Object.prototype.pipe = function(func) {
	var args = Array.prototype.slice.call(arguments, 1);
	var result = func.call(null, this, ...args);

	return result;
};