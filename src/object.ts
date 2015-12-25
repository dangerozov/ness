import array = require("./array");

export let values = (object: Object) =>
	array.toArray(object, keys(object));

export let keys = (object: Object) => {
	let result: string[] = [];
	for (var key in object) {
		result.push(key);
	}
	return result;
};

export let forEach = <T extends { [key: string]: any }, TValue>(object: T, callback: (value: TValue, key: string, object: T) => void) =>
	keys(object).forEach(key => callback(object[key], key, object));

export let isUndefined = (object: Object) => object === void 0;

export let assign: <T1, T2>(target: T1, source: T2) => T1 & T2 = (target: { [key: string]: any }, source: { [key: string]: any }) => {
    forEach(source, (value, key) => target[key] = value);
    return target;
};

export interface PropertyMap {
	[key: string]: (value: any) => any;
}

export let map = (left: Object, right: PropertyMap) => {
	let copied: { [key: string]: any }  = assign({}, left);
	forEach<PropertyMap, (value: any) => any>(right, (selector, key) => {
		copied[key] = selector(copied[key]);
	});
	return copied;
};