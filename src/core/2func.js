nessy.func = (() => {
	var f = {};

	f.before = (func, pre) => (...args) => {
		pre(...args);
		return func(...args);
	};
	f.spread = (func) => (args) => func(...args);
	f.map = (func, map) => (...args) => func(map(...args));
	f.isUndefined = (obj) => typeof obj === "undefined";
	
	return f;
})();

nessy.func = ((func) => {
	
	var result = nessy.builder()
		.chain("before", func.before)
		.chain("spread", func.spread)
		.chain("map", func.map)
		.value;
		
		/*		
		{
			before: nessy.builder.chain,
			spread: nessy.builder.chain,
			map: nessy.builder.chain
		}
		*/

	result = nessy.obj.copy(func, result);
	
	return result; 

})(nessy.func);

var fillRect = (x, y, width, height) => console.log(x, y, width, height);

fillRect = nessy.func(fillRect) // (x,y,w,h) -> x,y,w,h
	.spread()					// [x,y,w,h] -> (x,y,w,h) -> x,y,w,h
	.map(rect => nessy.obj.values(rect, ["x", "y", "width", "height"])) // {x,y,w,h} -> [x,y,w,h] -> (x,y,w,h) -> x,y,w,h
	.value;

fillRect({ x: 10, y: 20, width: 30, height: 40 });