nessy.func = ((builder, obj) => {
	var f = {};

	f.before = (func, pre) => (...args) => {
		pre(...args);
		return func(...args);
	};
	f.spread = (func) => (args) => func(...args);
	f.map = (func, map) => (...args) => func(map(...args));

	var result = builder()
		.chain("before", f.before)
		.chain("spread", f.spread)
		.chain("map", f.map)
		.value;

	obj.copy(f, result);

	return result;

})(nessy.builder, nessy.obj);

var fillRect = (x, y, width, height) => console.log(x, y, width, height);

fillRect = nessy.func(fillRect) // (x,y,w,h) -> x,y,w,h
	.spread()					// [x,y,w,h] -> (x,y,w,h) -> x,y,w,h
	.map(rect => nessy.obj(rect).values(["x", "y", "width", "height"])) // {x,y,w,h} -> [x,y,w,h] -> (x,y,w,h) -> x,y,w,h
	.value;