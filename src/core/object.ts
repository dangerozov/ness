export let toArray = (object: { [key: string]: any }, layout: string[], out: any[] = []) => {
	layout.forEach((key, index) => {
		out[index] = object[key];
	});
	return out;
};

export let values = (object: Object) =>
	toArray(object, keys(object));

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

export let copy = (object: { [key: string]: any }, out: { [key: string]: any } = {}) => {
	forEach(object, (value, key) => out[key] = value);
	return out;
};

export interface PropertyMap {
	[key: string]: (value: any) => any;
}

export let map = (left: Object, right: PropertyMap) => {
	let copied = copy(left);
	forEach<PropertyMap, (value: any) => any>(right, (selector, key) => {
		copied[key] = selector(copied[key]);
	});
	return copied;
};