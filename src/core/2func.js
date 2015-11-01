nessy.func = (() => {
	var f = {};
	
	f.before = (func, pre) => (...args) => {
		pre(...args);
		return func(...args);
	};
	f.map = (func, map) => (...args) => map(func, ...args);
	
	f.overload = (func, condition, map) => (...args) => 
		condition(...args) ? map(func, ...args) : func(...args);
	
	return f;
})();

nessy.func = ((func) => {
	
	var result = nessy.builder()
		.chain("before", func.before)
		.chain("spread", func.spread)
		.chain("map", func.map)
		.chain("overload", func.overload)
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


// mapping args
var fillRect = (x, y, width, height) => console.log(x, y, width, height);

fillRect = nessy.func(fillRect) 
	.map((func, rect) => func(rect.x, rect.y, rect.width, rect.height)) // {x,y,w,h} -> x,y,w,h
	.value;

fillRect({ x: 10, y: 20, width: 30, height: 40 });

// overloading
var abc = (x, y, z) => console.log(x, y, z);

abc = nessy.func(abc)
	.overload((...args) => args.length === 1, (func, obj) => func(obj.x, obj.y, obj.z))
	.overload((...args) => args.length === 2, (func, x, y) => func(x, y, 3))
	.value;

abc({ x: 1, y: 2, z: 3 });
abc(1, 2, 3);
abc(1, 2);