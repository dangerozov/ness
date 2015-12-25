import object = require("./core/object");
import builder = require("./core/builder");
import rect = require("./core/rectangle-builder");

import array = require("./core/array");
let q = array.contains([1,2,3], 2);
array.toObject([1,2,3], ["x", "y", "z"]);

import point = require("./core/point");
point.add({ x: 10, y: 20 }, { x: 30, y: 40 });

import pointBld = require("./core/point-builder");
console.log(pointBld({x:1,y:2}).add({x:3,y:4}).value);

interface ObjectUtils {
	values: () => any[];
	assign: (out: Object) => Object;
}

let obj = builder.build<ObjectUtils, Object>()
	.unbox("values", object.values)
	.cascade("assign", object.assign)
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

let result = array.toArray(pos, ["x", "y"]);
console.log(result);