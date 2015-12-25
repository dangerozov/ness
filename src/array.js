nessy.array = (() => {
	var a = {};
	
	a.sum = (array) => {
		return array.aggregate(0, (left, right) => left + right);
	};
	
	a.copyTo = (input, inputIndex, output, outputIndex, length) => {
		for (var i = 0; i < length; i++) {
			output[outputIndex + i] = input[inputIndex + i];
		}
	};
	
	a.toObject = (array, layout, object) => {
		object = object || {};
		for (var i = 0; i < layout.length; i++) {
			object[layout[i]] = array[i];
		}
		return object;
	};
	
	a.concat = (left, right, output) => {
		output = output || [];
		a.copyTo(left, 0, output, output.length, left.length);
		a.copyTo(right, 0, output, output.length, right.length);
		return output;
	};
	
	a.serialize = (() => {
		var tempArray = [];
		
		return (objects, layout, array) => {
			array = array || [];
			objects.forEach((object, index) => {
				nessy.obj.toArray(object, layout, tempArray);
				array.push(...tempArray);
			});
			return array;
		};
	})();
	
	a.deserialize = (() => {
		var tempArray = [];
		
		return (array, layout, count) => {
			var result = [];
			for (var index = 0; index < count; index++) {
				nessy.array.copyTo(array, index * layout.length, tempArray, 0, layout.length);
				var object = nessy.array.toObject(tempArray, layout); 
				result.push(object);
			}
			return result;
		};
	})();
	
	return a;
})();

console.log("===== array serialization =====");
var rects = [
	{ x: 10, y: 20, w: 30, h: 40 },
	{ x: 30, y: 40, w: 30, h: 40 },
	{ x: 50, y: 60, w: 30, h: 40 }
];

var layout = ["x", "y", "w", "h"];
var array = nessy.array.serialize(rects, layout);
console.log(array);

var objects = nessy.array.deserialize(array, layout, 3);
objects.forEach(object => console.log(object));