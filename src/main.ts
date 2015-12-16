import object = require("./core/object");
import builder = require("./core/builder");
import rect = require("./core/rectangle-builder");

import array = require("./core/array");
let q = array.contains([1,2,3], 2);
array.toObject([1,2,3], ["x", "y", "z"]);

interface ObjectUtils {
	values: () => any[];
	copy: (out: Object) => Object;
}

let obj = builder.build<ObjectUtils, Object>()
	.unbox("values", object.values)
	.cascade("copy", object.copy)
	.value;

// nessy.obj = ((obj) => {
// 	
// 	var result = nessy.builder()
// 		.unbox("values", obj.values)
// 		.cascade("copy", obj.copy)
// 		.value;
// 
// 	result = obj.copy(obj, result);
// 	 
// 	return result;
// 	
// })(nessy.obj);

builder.build()

let a : object.PropertyMap = {
	x: value => value + 5
};

object.map({}, a);

let pos = {
	x: 10,
	y: 20
};

let result = object.toArray(pos, ["x", "y"]);
console.log(result);