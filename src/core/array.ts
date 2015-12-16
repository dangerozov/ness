interface ArrayUtils {
	range: (start: number, count: number) => number[];
	
	concat: <T>(left: T[], right: T[], out: T[]) => T[];
	except: <T>(left: T[], right: T[]) => T[];
	aggregate: {
		<T>(source: T[], merge: (result: T, item: T) => T): T;
		<T>(source: T[], merge: (result: T, item: T) => T, accumulate: T): T;
	};
	
	first: <T>(source: T[], predicate: (item: T) => boolean) => T;
	contains: <T>(source: T[], value: T) => boolean;
	all: <T>(source: T[], predicate: (item: T) => boolean) => boolean;
	some: <T>(source: T[], predicate: (item: T) => boolean) => boolean;
	
	min: (source: number[], base: number) => number;
	max: (source: number[], base: number) => number;
	sum: (source: number[]) => number;
	
	copyTo: <T>(input: T[], inputIndex: number, output: T[], outputIndex: number, length: number) => void;
	toObject: (source: any[], layout: string[], out?: {}) => {};
	toArray: (object: {}, layout: string[], out?: any[]) => any[];
	serialize: <T extends {}>(source: T[], layout: string[], out?: any[]) => any[];
	deserialize: <T extends {}>(array: any[], layout: string[], count: number) => T[];
}

function aggregate<T>(source: T[], merge: (result: T, item: T) => T): T;
function aggregate<T>(source: T[], merge: (result: T, item: T) => T, accumulate?: T): T {
	let startIndex = 0;
	if (accumulate === void 0) {
		if (source.length < 1) throw "Can't aggregate empty array";
		accumulate = source[0];
		startIndex = 1;
	}
	
	for(let i = startIndex; i < source.length; i++) {
		accumulate = merge(accumulate, source[i]);
	}
	return accumulate;
};

let array: ArrayUtils = {
	range: (start, count) => {
		let result: number[] = [];
		for (let i = start; i < count; i++) {
			result.push(i);
		}
		return result;
	},
	
	concat: (left: any[], right: any[], out: any[] = [left.length + right.length]) => {
		array.copyTo(left, 0, out, out.length, left.length);
		array.copyTo(right, 0, out, out.length, right.length);
		return out;
	},
	except<T>(left: T[], right: T[]) {
		let result: T[] = [];
		for (let item of left) {
			if (!array.contains(right, item)) result.push(item);
		}
		return result;
	},
	aggregate: aggregate,
	
	first<T>(source: T[], predicate: (item: T) => boolean) {
		let result: T = null;
		for (let item of source) {
			if (predicate(item)) {
				result = item;
				break;
			}
		}
		return result;
	},	
	contains: (source: any[], value: any) => array.some(source, item => item === value),
	all: (source: any, predicate: (item: any) => boolean) => !array.some(source, predicate),
	some: (source: any, predicate: (item: any) => boolean = () => true) => Array.prototype.some.call(source, predicate),
	
	min: (source: number[], base: number) => Math.min(...[base, ...source]),
	max: (source: number[], base: number) => Math.max(...[base, ...source]),
	sum: (source: number[]) => array.aggregate(source, (sum, item) => sum + item, 0),
	
	copyTo: (input: any[], inputIndex: number, output: any[], outputIndex: number, length: number) => {
		for (let i = 0; i < length; i++) {
			output[outputIndex + i] = input[inputIndex + i];
		}
	},
	toObject: (source: any[], layout: string[], out: { [key: string]: any } = {}) => {
		for (let i = 0; i < layout.length; i++) {
			out[layout[i]] = source[i];
		}
		return out;
	},
	toArray: (object: { [key: string]: any }, layout: string[], out: any[] = []) => {
		layout.forEach((key, index) => {
			out[index] = object[key];
		});
		return out;
	},
	serialize: (objects: {}[], layout: string[], out: any[] = []) => {
		let temp: any[] = [layout.length];
		objects.forEach((object, index) => {
			array.toArray(object, layout, temp);
			out.push(...temp);
		})
		return out;
	},
	deserialize: (source: any[], layout: string[], count: number) => {
		let result: any[] = [];
		let temp: any[] = [layout.length];
		for(let index = 0; index < count; index++) {
			array.copyTo(source, index * layout.length, temp, 0, layout.length);
			let object = array.toObject(temp, layout);
			result.push(object);
		}
		return result;
	}
};

console.log("===== array serialization =====");
var rects = [
	{ x: 10, y: 20, w: 30, h: 40 },
	{ x: 30, y: 40, w: 30, h: 40 },
	{ x: 50, y: 60, w: 30, h: 40 }
];

var layout = ["x", "y", "w", "h"];
var source = array.serialize(rects, layout);
console.log(source);

var objects = array.deserialize(source, layout, 3);
objects.forEach(object => console.log(object));

export = array;