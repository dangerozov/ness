nessy.obj = (() => {
	var o = {};

	o.values = (obj, keys) => keys.map(key => obj[key]);
	
	o.keys = (obj) => {
		var result = [];
		for (var key in obj) {
			result.push(key);
		}
		return result;
	};
	
	o.forEach = (obj, callback) => o
		.keys(obj)
		.forEach(key => callback(obj[key], key, obj));
	
	o.isUndefined = (obj) => typeof obj === "undefined";

	o.copy = (obj, target) => {
		o.forEach(obj, (value, key) => target[key] = value);
		return target;
	};
	
	o.with = (left, right) => {
		var copy = o.copy(left, {});
		o.forEach(right, (selector, key) => {
			copy[key] = selector(copy[key]);
		});
		return copy;
	};
	
	return o;	
})();

nessy.obj = ((obj) => {
	
	var result = nessy.builder()
		.unbox("values", obj.values)
		.cascade("copy", obj.copy)
		.value;

	result = obj.copy(obj, result);
	 
	return result;
	
})(nessy.obj);