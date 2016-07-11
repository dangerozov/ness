import string = require('./string');
import object = require('./object');
import maybe = require('./monads/maybe');

export let fromGetter = (key: string | number) => (context: any) => context[key];
export let toStatic = (func: Function) => (context: any, ...args: any[]) => func.call(context, ...args);
export let fromObjectProperty = (key: string | number, obj: any) => {
    const value = object.get(key, obj);
    
    return maybe.map(value, value => typeof value === 'function'
        ? toStatic(value)
        : fromGetter(key));
};

export let before = (func: any, pre: any) =>
    (...args: any[]) => {
        pre(...args);
        return func(...args);
    };

export let map = (func: any, map: (func: any, ...args: any[]) => any) =>
    (...args: any[]) => map(func, ...args);

export let overload = (func: any, condition: any, map: any) =>
    (...args: any[]) => condition(...args) ? map(func, ...args) : func(...args);
    

console.log("===== mapping args =====");
let fillRect = (x: number, y: number, width: number, height: number) => console.log(x, y, width, height);

let fillRectMapped = map(
    fillRect,
    (func, rect) => func(rect.x, rect.y, rect.width, rect.height)); // {x,y,w,h} -> x,y,w,h

fillRectMapped({ x: 10, y: 20, width: 30, height: 40 });

console.log("===== function overloading =====");
let abc = (x: number, y: number, z: number) => console.log(x, y, z);

let abc2 = overload(
    abc,
    (...args: any[]) => args.length === 1,
    (func: any, obj: any) => func(obj.x, obj.y, obj.z));
    
let abc3 = overload(
    abc2,
    (...args: any[]) => args.length === 2,
    (func: any, x: any, y: any) => func(x, y, 3));

abc3({ x: 1, y: 2, z: 3 });
abc3(1, 2, 3);
abc3(1, 2);



