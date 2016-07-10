export let bind = <T, U>(source: T[], callback: (item: T) => U[]) => {
    let result: U[] = [];
    forEach(source, (item) => result.push(...callback(item)));
    return result;
};

export let forEach = <T>(source: ArrayLike<T>, callback: (value: T, index: number, source: ArrayLike<T>) => void) => Array.prototype.forEach.call(source, callback);

export function reduce<T, U>(source: T[], func: (result: U, current: T, index: number, source: T[]) => T): U;
export function reduce<T, U>(source: T[], func: (result: U, current: T, index: number, source: T[]) => T, initial: U): U;
export function reduce<T, U>(source: T[], func: (result: U, current: T, index: number, source: T[]) => T, initial?: U): U {
    return initial === void 0
        ? Array.prototype.reduce.call(source, func)
        : Array.prototype.reduce.call(source, func, initial);
};

export let range = (start: number, count: number) => {
    let result: number[] = new Array(count);
    for (let i = start; i < count; i++) {
        result[i];
    }
    return result;
};

export let concat = <T>(left: T[], right: T[], out: T[] = new Array<T>(left.length + right.length)) => {
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
export let every = <T>(source: T[], predicate: (item: T) => boolean = () => true) => Array.prototype.every.call(source, predicate);
export let some = <T>(source: T[], predicate: (item: T) => boolean = () => true) => Array.prototype.some.call(source, predicate);

export let min = (source: number[], base: number) => Math.min(...[base, ...source]);
export let max = (source: number[], base: number) => Math.max(...[base, ...source]);
export let sum = (source: number[]) => reduce(source, (sum, item) => sum + item, 0);

export let copyTo = (input: ArrayLike<any>, inputIndex: number, output: ArrayLike<any>, outputIndex: number, length: number) => {
    for (let i = 0; i < length; i++) {
        output[outputIndex + i] = input[inputIndex + i];
    }
};

type Indexer = { get: (index: number) => any, set: (index: number, value: any) => void };
export function withLayout(layout: number[]) : Indexer;
export function withLayout(layout: string[]) : Indexer;
export function withLayout(layout: number[] | string[]) : Indexer {
    if (typeof layout[0] === 'number') {
        let array: any[] = [];
        return {
            get: (index: number) => {
                
            },
            set: (index: number, value: any) => {
                
            }
        }
    }
};

export let undestrArray = (source: any[], layout: any[], out: any[] = new Array(layout.length)) => {
    layout.forEach((value, index) => {
        out[value] = source[index];
    });
    return out;
};

export let undestrObject = (source: any[], layout: any[], out: { [key: string]: any } = {}): { [key: string]: any } => {
    layout.forEach((value, index) => {
        out[value] = source[index];
    });
    return out;
};

export let destr = (object: { [key: string]: any }, layout: any[], out: any[] = new Array(layout.length)): any[] => {
    layout.forEach((key, index) => {
        out[index] = object[key];
    });
    return out;
};

export let serialize = <T>(objects: ArrayLike<any>, layout: any[], out: ArrayLike<T> = new Array(objects.length * layout.length)) => {
    let temp: any[] = new Array(layout.length);
    forEach(objects, (object, index) => {
        destr(object, layout, temp);
        copyTo(temp, 0, out, index * layout.length, layout.length);
    })
    return out;
};

export let deserialize = (source: ArrayLike<any>, layout: string[]) => {
    let count = source.length / layout.length;
    let result: any[] = new Array(count);
    let temp: any[] = new Array(layout.length);
    for(let index = 0; index < count; index++) {
        copyTo(source, index * layout.length, temp, 0, layout.length);
        let object = undestrObject(temp, layout);
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
// var source = reduce(
//     rects.map(rect => toArray(rect, layout)),
//     (result, current) => concat(result, current));
console.log(source);

var objects = deserialize(source, layout);
objects.forEach((object: any) => console.log(object));