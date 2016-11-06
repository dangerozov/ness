import monads = require('../monads');
import builder = require('fluent-interface-builder');

export let run = <T, U>(reader: monads.Reader<T, U>, args: T) => {
    return reader(args);
};

export let _return = <T, U>(value: U): monads.Reader<T, U> => 
    (args: T) => {
        return value;
    };

export let map = <T, U, V>(reader: monads.Reader<T, U>, map: (item: U) => V) => {
    let result: monads.Reader<T, V> = (args: T) => {
        return map(run(reader, args));
    };
    return result;
};

export let bind = <T, U, V>(reader: monads.Reader<T, U>, bind: (item: U) => monads.Reader<T, V>) => {
    let result: monads.Reader<T, V> = (args: T) => {
        return run(bind(run(reader, args)), args);  
    };
    return result;
};

interface ChainedReader<T, U> {
    value: monads.Reader<T, U>
    map<V>(selector: (item: U) => V): ChainedReader<T, V>
    bind<V>(selector: (item: U) => monads.Reader<T, V>): ChainedReader<T, V>
};

export let chain = <T, U>(reader: monads.Reader<T, U>) => builder.build<ChainedReader<T, U>, monads.Reader<T, U>>()
    .chain("map", <V>(selector: (item: U) => V) => (reader: monads.Reader<T, U>) => map(reader, selector))
    .chain("bind", <V>(selector: (item: U) => monads.Reader<T, V>) => (reader: monads.Reader<T, U>) => bind(reader, selector))
    .value(reader);

// usage
interface Dependencies { p0: number };

let doWithDeps: (p1: number) => monads.Reader<Dependencies, number> = (p1) =>
    deps => {
        return p1 + deps.p0;
    };

let doubleWithDeps = (num: number) => (ask: Dependencies) => {
    let c1 = run(doWithDeps(150), ask);
    let c2 = run(doWithDeps(200), ask);
    return c1 + c2 + num;
};

let doWithoutDeps = (p1: number) => p1 * 2;

let resultWithDeps = _return<Dependencies, number>(321);
resultWithDeps = bind(resultWithDeps, doWithDeps);
resultWithDeps = bind(resultWithDeps, doubleWithDeps);
resultWithDeps = map(resultWithDeps, doWithoutDeps);
console.log("Reader result =", run(resultWithDeps, { p0: 123 }));

let rslt = chain(_return<Dependencies, number>(321))
    .bind(num => deps => num + deps.p0)
    .bind(
        num => bind((deps: Dependencies) => 150 + deps.p0,
            c1 => map((deps: Dependencies) => 200 + deps.p0,
                c2 => c1 + c2 + num)))
    .map(num => num * 2)
    .value;

console.log("Chained reader result = ", run(rslt, { p0: 123 }));
    