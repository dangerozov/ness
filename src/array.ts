export function aggregate<T>(source: T[], merge: (result: T, item: T) => T): T;
export function aggregate<T>(source: T[], merge: (result: T, item: T) => T, accumulate: T): T;
export function aggregate<T>(source: T[], merge: (result: T, item: T) => T, accumulate?: T): T {
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

export let range = (start: number, count: number) => {
    let result: number[] = [];
    for (let i = start; i < count; i++) {
        result.push(i);
    }
    return result;
};

export let concat = (left: any[], right: any[], out: any[] = [left.length + right.length]) => {
    copyTo(left, 0, out, 0, left.length);
    copyTo(right, 0, out, left.length, right.length);
    return out;
};

export let except = <T>(left: T[], right: T[]) => {
    let result: T[] = [];
    for (let item of left) {
        if (!contains(right, item)) result.push(item);
    }
    return result;
};

export let first = <T>(source: T[], predicate: (item: T) => boolean) => {
    let result: T = null;
    for (let item of source) {
        if (predicate(item)) {
            result = item;
            break;
        }
    }
    return result;
};

export let contains = <T>(source: T[], value: T) => some(source, item => <any>item === <any>value);
export let all = <T>(source: T[], predicate: (item: T) => boolean) => {
    let result = true;
    for (let item of source) {
        if (!predicate(item)) {
            result = false;
            break;
        }
    }
    return result;
};
export let some = <T>(source: T[], predicate: (item: T) => boolean = () => true) => Array.prototype.some.call(source, predicate);

export let min = (source: number[], base: number) => Math.min(...[base, ...source]);
export let max = (source: number[], base: number) => Math.max(...[base, ...source]);
export let sum = (source: number[]) => aggregate(source, (sum, item) => sum + item, 0);

export let copyTo = (input: any[], inputIndex: number, output: any[], outputIndex: number, length: number) => {
    for (let i = 0; i < length; i++) {
        output[outputIndex + i] = input[inputIndex + i];
    }
};

export let toObject = (source: any[], layout: string[], out: { [key: string]: any } = {}) => {
    for (let i = 0; i < layout.length; i++) {
        out[layout[i]] = source[i];
    }
    return out;
};

export let toArray = (object: { [key: string]: any }, layout: string[], out: any[] = []) => {
    layout.forEach((key, index) => {
        out[index] = object[key];
    });
    return out;
};

export let serialize = (objects: {}[], layout: string[], out: any[] = []) => {
    let temp: any[] = [layout.length];
    objects.forEach((object, index) => {
        toArray(object, layout, temp);
        out.push(...temp);
    })
    return out;
};

export let deserialize = (source: any[], layout: string[], count: number) => {
    let result: any[] = [];
    let temp: any[] = [layout.length];
    for(let index = 0; index < count; index++) {
        copyTo(source, index * layout.length, temp, 0, layout.length);
        let object = toObject(temp, layout);
        result.push(object);
    }
    return result;
};

console.log("===== array serialization =====");
var rects = [
	{ x: 10, y: 20, w: 30, h: 40 },
	{ x: 30, y: 40, w: 30, h: 40 },
	{ x: 50, y: 60, w: 30, h: 40 }
];

var layout = ["x", "y", "w", "h"];
var source = serialize(rects, layout);
console.log(source);

var objects = deserialize(source, layout, 3);
objects.forEach((object: any) => console.log(object));