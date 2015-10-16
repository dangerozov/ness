nessy.obj = ((builder) => {
	var o = {};

	o.values = (obj, names) => names.map(name => obj[name]);

	o.copy = (obj, target) => {
		for (var name in obj) {
			target[name] = obj[name];
		}
	};

	var result = builder()
		.unbox("values", o.values)
		.cascade("copy", o.copy)
		.value;

	o.copy(o, result);

	return result;
	
})(nessy.builder);