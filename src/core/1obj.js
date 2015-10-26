nessy.obj = (() => {
	var o = {};

	o.values = (obj, names) => names.map(name => obj[name]);
	
	o.forEach = (obj, callback) => {
		for (var name in obj) {
			callback(obj[name], name, obj);
		}
	};

	o.copy = (obj, target) => {
		o.forEach(obj, (value, name) => target[name] = value);
		return target;
	};
	
	o.with = (left, right) => {
		var copy = o.copy(left, {});
		o.forEach(right, (selector, name) => {
			copy[name] = selector(copy[name]);
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