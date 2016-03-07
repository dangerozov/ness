type Reader<T, U> = (deps: U) => T;

export let run = <T, U>(reader: Reader<T, U>, deps: U) => {
    return reader(deps);
};

export let _return = <T, U>(value: T) => 
    (deps: U) => {
        return value;
    };

export let map = <T, U, V>(reader: Reader<T, U>, map: (item: T) => V) => {
    let result: Reader<V, U> = (deps: U) => {
        return map(run(reader, deps));
    };
    return result;
};

export let bind = <T, U, V>(reader: Reader<T, U>, bind: (item: T) => Reader<V, U>) => {
    let result: Reader<V, U> = (deps: U) => {
        return run(bind(run(reader, deps)), deps);
    };
    return result;
};

// usage
interface Dependencies { p0: number };

let doWithDeps: (p1: number) => Reader<number, Dependencies> = (p1) =>
    deps => {
        return p1 + deps.p0;
    };

let doubleWithDeps = () => (ask: Dependencies) => {
    let c1 = run(doWithDeps(150), ask);
    let c2 = run(doWithDeps(200), ask);
    return c1 + c2;
};

let doWithoutDeps = (p1: number) => p1 * 2;

let resultWithDeps = _return<number, Dependencies>(321);
resultWithDeps = bind(resultWithDeps, doWithDeps);
resultWithDeps = bind(resultWithDeps, doubleWithDeps);
resultWithDeps = map(resultWithDeps, doWithoutDeps);

let result = run(resultWithDeps, { p0: 123 });
console.log(result);